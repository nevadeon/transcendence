import argon2 from "argon2";
import { saveToken } from "../utils/tokens.js";

async function authRoutes(fastify) {
	const { db, auth } = fastify;

	// Register
	fastify.post("/register", async (req, reply) => {
		const { name, email, password } = req.body;
		try {
			const hashed = await argon2.hash(password);
			const result = await db.run(
				"INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
				[name, email, hashed]
			);
			return reply.code(201).send({ id: result.lastID, name, email });
		} catch (err) {
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

			return { ...user, token };
		} catch (err) {
			return reply.code(500).send({ error: err.message });
		}
	});
}

export default authRoutes;
