// import { OAuth2Client } from 'google-auth-library';
import { deleteToken, saveToken } from "../utils/tokens.js";
import { getVaultSecret } from "../plugins/vault.js";
import { authenticator } from 'otplib';
import argon2 from "argon2";
import crypto from 'crypto';

// const GOOGLE_CLIENT_ID = await getVaultSecret("user-profile/config", "GOOGLE_CLIENT_ID");
// const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const TWO_FACTOR_HEADER = 'x-two-factor-code';

async function generateDimension() {
	const dimension = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const letter = dimension.charAt(Math.floor(Math.random() * dimension.length));
	const number = String(Math.floor(Math.random() * 25)).padStart(3, '0');
	return `${letter}-${number}`;
}

async function generateSpecies() {
	const species = ["Brogh", "Human", "Chud", "Glorzo", "Harold", "Kitler", "Penp", "Varrix"];
	const specie = species[(Math.floor(Math.random() * species.length))];
	return `${specie}`;
}

async function generateplanets() {
	const planets = ["Biggum", "Delphi6", "Dorian5", "E-10", "Earth", "Ferkus9", "Flump", "Gaia", "Jupiter", "Mars", "Neptune", "Pluto", "Saturn", "Scrotia", "Snorlab", "Timbus", "Uranus", "Venus", "Yarple7", "Zipple"];
	const planet = planets[(Math.floor(Math.random() * planets.length))];
	return `${planet}`;
}

async function authRoutes(fastify) {
	const { db, auth } = fastify;

	// Register
	fastify.post("/register", async (req, reply) => {
		const { name, email, password } = req.body;
		try {
			const SECRET_SALT = await getVaultSecret("SECRET_SALT");
			const hashed_password = await argon2.hash(password);
			const hashed_email = crypto.createHash('sha256').update(email + SECRET_SALT).digest('hex');
			await db.run(
				"INSERT INTO users(name, email, password, species, planet, dimension) VALUES(?, ?, ?, ?, ?, ?)",
				[name, hashed_email, hashed_password, await generateSpecies(), await generateplanets(), await generateDimension()]
			);
			const user = await db.get("SELECT * FROM users WHERE name=?", [name]);
			const token = auth.generateLongToken(user);
			await saveToken(db, name, token, '+1 hour');
			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar FROM users WHERE name=?",
				[name]
			);
			console.log(user_data.dimension);
			return reply.code(201).send({ user: user_data, token });
		} catch (err) {
			fastify.log.error("Erreur SQL :", err.message);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.name')) {
					return reply.code(409).send({
						field: "name",
						error: "USERNAME ALREADY EXISTS",
					});
				}
				if (err.message.includes('users.email')) {
					return reply.code(409).send({
						field: "email",
						error: "EMAIL ALREADY EXISTS",
					});
				}
				// Erreur UNIQUE générique
				return reply.code(409).send({
					field: "password",
					error: "ENTRY ALREADY EXISTS"
				});
			}
			return reply.code(500).send({ field: "password", msg: "SERVER ERROR" });
		}
	});

	async function issueUserSession(reply, user) {
		// user doit contenir l'id et le name
		const token = auth.generateLongToken(user);
		await saveToken(db, user.name, token, '+1 hour');
		const user_data = await db.get( "SELECT id, name, species, planet, dimension, avatar FROM users WHERE id=?", [user.id] );
		return reply.code(201).send({ user: user_data, token });
	}

	fastify.post("/register/google/verify", async (req, reply) => {
		const { accessToken } = req.body;

		if (!accessToken)
			return reply.code(400).send({ message: "Access Token manquant." });

		try {
			const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: { 'Authorization': `Bearer ${accessToken}` }
			});
			const googleUserData = await googleRes.json();
			if (googleRes.status !== 200) {
				return reply.code(401).send({ message: "Jeton Google invalide ou expiré." });
			}
			const { sub: googleId, email, given_name } = googleUserData;
		
			// CONNEXION / INSCRIPTION
			let user = await db.get("SELECT * FROM users WHERE googleId=?", [googleId]);
			if (user)
				return issueUserSession(reply, user);
			user = await db.get("SELECT * FROM users WHERE email=?", [email]); // si deja log via credentials, et veux OAuth ensuite
			if (user) {
				await db.run("UPDATE users SET googleId=? WHERE id=?", [googleId, user.id]);
				return issueUserSession(reply, user);
			} else {
				const SECRET_SALT = await getVaultSecret("SECRET_SALT");
				const hashed_email = crypto.createHash('sha256').update(email + SECRET_SALT).digest('hex');
				await db.run(
					"INSERT INTO users(name, email, googleId, species, planet, dimension) VALUES(?, ?, ?, ?, ?, ?)",
					[given_name, hashed_email, googleId, await generateSpecies(), await generateplanets(), await generateDimension()]
				);
				const newUser = await db.get("SELECT * FROM users WHERE googleId=?", [googleId]);
				if (newUser)
					return issueUserSession(reply, newUser); //RESPONSE
				else
					throw new Error("Erreur lors de la récupération du nouvel utilisateur."); //RESPONSE(to catch)
			}
		} catch (err) {
			fastify.log.error("Erreur Google Auth:", err.message);
			return reply.code(401).send({ message: "Authentification via Google échouée." }); //RESPONSE
		}
	});

	// Login
	fastify.post("/login", async (req, reply) => {
		const { name, password } = req.body;
		try {
			const user = await db.get("SELECT * FROM users WHERE name=?", [name]);
			if (!user)
				return reply.code(401).send({ field: 'name', error: "Invalid name or password" });

			const valid = await argon2.verify(user.password, password);
			if (!valid)
				return reply.code(401).send({ field: 'password', error: "Invalid name or password" });

			let token;
			if (user.two_factor === 0) {
				token = auth.generateLongToken(user);
				await saveToken(db, name, token, '+1 hour');
			} else {
				const is2FAActive = user.two_factor === 1 && user.two_factor_secret;
				const twoFactorCode = req.headers[TWO_FACTOR_HEADER];
				if (is2FAActive && !twoFactorCode) {
					return reply.code(403).send({
						message: "Authentification à deux facteurs requise.",
						needs_2fa: true
					});
				}
				if (is2FAActive && twoFactorCode) {
					authenticator.options = { window: 1 };
					const isValid = authenticator.verify({ token: twoFactorCode, secret: user.two_factor_secret });
					if (!isValid) {
						return reply.code(401).send({ message: "Code 2FA incorrect ou expiré." });
					}
				}
				token = auth.generateShortToken(user);
				await saveToken(db, name, token, '+5 min');
			}
			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar, two_factor FROM users WHERE name=?",
				[name]
			);
			return reply.code(201).send({ user: user_data, token });
		} catch (err) {
			fastify.log.error("Erreur SQL :", err.message);
			return reply.code(500).send({ field: 'password', error: err.message });
		}
	});

	// fastify.post("/two_factor", async (req, body) => {
	// 	const { name } = req.body;
	// 	try {
	// 		const user = await db.get("SELECT * FROM users WHERE name=?", [name]);
	// 		if (!user)
	// 			return reply.code(401).send({ error: "Invalid two_factor." });
	// 		await deleteToken(db, user.token);
	// 		const token = auth.generateLongToken(user);
	// 		await saveToken(db, name, token, '+1 hour');
	// 		const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar, two_factor FROM users WHERE name=?",
	// 			[name]
	// 		);
	// 		return reply.code(201).send({ user: user_data, token });
	// 	} catch (err) {
	// 		fastify.log.error("Erreur SQL :", err.message);
	// 		return reply.code(500).send({ error: err.message });
	// 	}
	// });
}

export default authRoutes;
