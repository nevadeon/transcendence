// import { OAuth2Client } from 'google-auth-library';
import { deleteToken, saveToken } from "../utils/tokens.js";
import { getVaultSecret } from "../plugins/vault.js";
import argon2 from "argon2";
import crypto from 'crypto';

// const GOOGLE_CLIENT_ID = await getVaultSecret("user-profile/config", "GOOGLE_CLIENT_ID");
// const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function authRoutes(fastify) {
	const { db, auth } = fastify;

	// Register
	fastify.post("/register", async (req, reply) => {
		const { name, email, password } = req.body;
		try {
			const SECRET_SALT = await getVaultSecret("user-profile/config", "SECRET_SALT");
			const hashed_password = await argon2.hash(password);
			const hashed_email = crypto.createHash('sha256').update(email + SECRET_SALT).digest('hex');
			await db.run(
				"INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
				[name, hashed_email, hashed_password]
			);
			const user = await db.get("SELECT * FROM users WHERE name=?", [name]);
			const token = auth.generateLongToken(user);
			await saveToken(db, name, token, '+1 hour');
			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar FROM users WHERE name=?",
				[name]
			);
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

	// async function issueUserSession(reply, user) {
    //     // user doit contenir l'id et le name
    //     const token = auth.generateLongToken(user);
    //     await saveToken(db, user.name, token, '+1 hour');
    //     const user_data = await db.get( "SELECT id, name, species, planet, dimension, avatar FROM users WHERE id=?", [user.id] );
    //     return reply.code(201).send({ user: user_data, token });
    // }

	// fastify.post("/register/google/verify", async (req, reply) => {
    //     const { idToken } = req.body; // Token envoyé par le frontend
    //     if (!idToken)
    //         return reply.code(400).send({ message: "ID Token Google manquant." }); // #TODO console.error OU <Register />(page) recup et affiche in <Form />
    //     try {
    //         // 1. VÉRIFICATION SÉCURISÉE DU TOKEN GOOGLE
    //         const ticket = await googleClient.verifyIdToken({ idToken: idToken, audience: GOOGLE_CLIENT_ID });
	// 		const payload = ticket.getPayload();
    //         if (!payload || !payload.sub || !payload.email)
    //             return reply.code(401).send({ message: "Token invalide ou données manquantes." }); //RESPONSE

	// 		const googleId = payload.sub; // googleId unique
    //         const email = payload.email;
    //         const name = payload.name || payload.given_name || 'GoogleUser';
	// 		// 2. GESTION CONNEXION / INSCRIPTION (Upsert)
	// 		let user = await db.get("SELECT * FROM users WHERE googleId=?", [googleId]);
    //         if (user)
    //             return issueUserSession(reply, user); //RESPONSE

	// 		user = await db.get("SELECT * FROM users WHERE email=?", [email]); // si deja log via credentials, et veux OAuth ensuite
	// 		if (user) {
    //             await db.run("UPDATE users SET googleId=? WHERE id=?", [googleId, user.id]);
    //             return issueUserSession(reply, user); //RESPONSE
    //         } else {
    //             // INSCRIPTION: Nouvel utilisateur, l'enregistrer dans la DB
    //             const SECRET_SALT = await getVaultSecret("user-profile/config", "SECRET_SALT");
    //             const hashed_email = crypto.createHash('sha256').update(email + SECRET_SALT).digest('hex');
    //             // Insérer le new user (sans mot de passe, mais avec googleId)
    //             await db.run(
    //                 "INSERT INTO users(name, email, googleId) VALUES(?, ?, ?)",
    //                 [name, hashed_email, googleId]
    //             );
    //             const newUser = await db.get("SELECT * FROM users WHERE googleId=?", [googleId]);
    //             if (newUser)
    //                 return issueUserSession(reply, newUser); //RESPONSE
    //             else
    //                 throw new Error("Erreur lors de la récupération du nouvel utilisateur."); //RESPONSE(to catch)
    //         }
	// 	} catch (err) {
    //         fastify.log.error("Erreur Google Auth:", err.message);
    //         return reply.code(401).send({ message: "Authentification via Google échouée." }); //RESPONSE
    //     }
    // });

	// Login
	fastify.post("/login", async (req, reply) => {
		const { name, password } = req.body;
		try {
			const user = await db.get("SELECT * FROM users WHERE name=?", [name]);
			if (!user)
				return reply.code(401).send({ error: "Invalid name or password" });

			const valid = await argon2.verify(user.password, password);
			if (!valid)
				return reply.code(401).send({ error: "Invalid name or password" });

			let token;
			if (user.two_factor === 0) {
				token = auth.generateLongToken(user);
				await saveToken(db, name, token, '+1 hour');
			} else {
				token = auth.generateShortToken(user);
				await saveToken(db, name, token, '+5 min');
			}
			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar, two_factor FROM users WHERE name=?",
				[name]
			);
			return { user: user_data, token };
		} catch (err) {
			fastify.log.error("Erreur SQL :", err.message);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.post("/two_factor", async (req, body) => {
		const { name } = req.body;
		try {
			const user = await db.get("SELECT * FROM users WHERE name=?", [name]);
			if (!user)
				return reply.code(401).send({ error: "Invalid two_factor." });
			await deleteToken(db, user.token);
			const token = auth.generateLongToken(user);
			await saveToken(db, name, token, '+1 hour');
			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar, two_factor FROM users WHERE name=?",
				[name]
			);
			return reply.code(201).send({ user: user_data, token });
		} catch (err) {
			fastify.log.error("Erreur SQL :", err.message);
			return reply.code(500).send({ error: err.message });
		}
	});
}

export default authRoutes;
