import argon2 from "argon2";
import { deleteToken, saveToken } from "../utils/tokens.js";
import { getVaultSecret } from "../plugins/vault.js";
import crypto from 'crypto';

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
			const user = await db.get("SELECT * FROM users WHERE name = ?", [name]);
			const token = auth.generateLongToken(user);
			await saveToken(db, name, token, '+1 hour');
			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar FROM users WHERE name = ?",
				[name]
			);
			return reply.code(201).send({ user: user_data, token });
		} catch (err) {
			fastify.log.error("Erreur SQL :", err.message);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.name')) {
					return reply.code(409).send({ 
						error: "Username already exists",
						field: "name"
					});
				}
				if (err.message.includes('users.email')) {
					return reply.code(409).send({ 
						error: "Email already exists",
						field: "email"
					});
				}
				// Erreur UNIQUE générique
				return reply.code(409).send({ 
					error: "This entry already exists" 
				});
			}
			return reply.code(500).send({ error: err.message });
		}
	});

	// Login
	fastify.post("/login", async (req, reply) => {
		const { name, password } = req.body;
		try {
			const user = await db.get("SELECT * FROM users WHERE name = ?", [name]);
			if (!user)
				return reply.code(401).send({ error: "Invalid name or password" });

			const valid = await argon2.verify(user.password, password);
			if (!valid)
				return reply.code(401).send({ error: "Invalid name or password" });

			let token;
			if (user.two_factor === 0) {
				console.log("HERE");
				token = auth.generateLongToken(user);
				console.log("HERE");
				await saveToken(db, name, token, '+1 hour');
				console.log("HERE");
			} else {
				token = auth.generateShortToken(user);
				await saveToken(db, name, token, '+5 min');
			}
			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar, two_factor FROM users WHERE name = ?",
				[name]
			);
			console.log("HERE");
			return { user: user_data, token };
		} catch (err) {
			fastify.log.error("Erreur SQL :", err.message);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.post("/two_factor", async (req, body) => {
		const { name } = req.body;
		try {
			const user = await db.get("SELECT * FROM users WHERE name = ?", [name]);
			if (!user) return reply.code(401).send({ error: "Invalid two_factor." });

			await deleteToken(db, user.token);
			const token = auth.generateLongToken(user);
			await saveToken(db, name, token, '+1 hour');

			const user_data = await db.get("SELECT id, name, species, planet, dimension, avatar, two_factor FROM users WHERE name = ?",
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
