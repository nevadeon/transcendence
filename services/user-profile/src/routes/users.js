import argon2 from "argon2";
import { getVaultSecret } from "../plugins/vault.js";
import crypto from 'crypto';

async function userRoutes(fastify) {
	const { db } = fastify;

	fastify.get("/users", async () => {
		return await db.all("SELECT * FROM users");
	});

	fastify.get("/users/:id/", async (req, reply) => {
		const user = await db.get("SELECT * FROM users WHERE id = ?", [req.params.id]);
		if (!user) return reply.code(404).send({ error: "User not found" });
		return reply.code(201).send({user: user});
	});

	fastify.put("/users/:id/name", async (req, reply) => {
		const { name } = req.body;
		try {
			const result = await db.run(
				"UPDATE users SET name=? WHERE id=?",
				[name, req.params.id]
			);
			if (result.changes === 0)
				return reply.code(404).send({ error: "Username has not change." });
			console.log('after 404');
			return reply.code(200).send({ name: name });
		} catch (err) {
			fastify.log.error(err);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.name')) {
					return reply.code(409).send({ 
						error: "Username already exists"
					});
				}
			}
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.put("/users/:id/email", async (req, reply) => {
		const { email } = req.body;
		const SECRET_SALT = await getVaultSecret("user-profile/config", "SECRET_SALT");
		const hashed_email = crypto.createHash('sha256').update(email + SECRET_SALT).digest('hex');
		try {
			const result = await db.run(
				"UPDATE users SET email=? WHERE id=?",
				[hashed_email, req.params.id]
			);
			if (result.changes === 0)
				return reply.code(404).send({ error: "Email has not change." });
			return reply.code(200).send({ email: email });
		} catch (err) {
			fastify.log.error(err);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.email')) {
					return reply.code(409).send({ 
						error: "Email already exists"
					});
				}
			}
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.put("/users/:id/password", async (req, reply) => {
		const { password } = req.body;
		try {
			const user = await db.get(
				"SELECT password FROM users WHERE id = ?",
				[req.params.id]
			);
			const test = await argon2.verify(user.password, password);
			if (test)
				return reply.code(404).send({ error: "Password has not change." });

			const hashed_password = await argon2.hash(password);
			await db.run(
				"UPDATE users SET password = ? WHERE id = ?",
				[hashed_password, req.params.id]
			);
			return reply.code(200);
		} catch (err) {
			fastify.log.error(err);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.email')) {
					return reply.code(409).send({ 
						error: "Password already exists"
					});
				}
			}
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.delete("/users/:id", async (req, reply) => {
		const result = await db.run("DELETE FROM users WHERE id=?", [req.params.id]);
		if (result.changes === 0) return reply.code(404).send({ error: "User not found" });
		return { message: "Deleted successfully" };
	});
}

export default userRoutes;
