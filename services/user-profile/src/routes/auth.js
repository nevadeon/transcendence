import argon2 from "argon2";
import { saveToken } from "../utils/tokens.js";
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
			const token = auth.generateToken(user);
			await saveToken(db, name, token);
			const user_data = await db.get("SELECT id, name, email, species, planet, dimension, avatar FROM users WHERE name = ?",
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
			if (!user) return reply.code(401).send({ error: "Invalid name or password" });

			const valid = await argon2.verify(user.password, password);
			if (!valid) return reply.code(401).send({ error: "Invalid name or password" });

			const token = auth.generateToken(user);
			await saveToken(db, name, token);

			const user_data = await db.get("SELECT id, name, email, species, planet, dimension, avatar FROM users WHERE name = ?",
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
