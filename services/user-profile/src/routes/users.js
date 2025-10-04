import argon2 from "argon2";
import { getVaultSecret } from "../plugins/vault.js";
import crypto from 'crypto';

async function userRoutes(fastify) {
	const { db } = fastify;

	fastify.get("/users", async () => {
		return await db.all("SELECT * FROM users");
	});

	fastify.get("/users/:id/", async (req, reply) => {
		const user = await db.get("SELECT * FROM users WHERE id=?", [req.params.id]);
		if (!user)
			return reply.code(404).send({ error: "USER NOT FOUND" });
		return reply.code(201).send({user: user});
	});

	fastify.put("/users/:id/name", async (req, reply) => {
		const { name: rawName } = req.body;
		const name = rawName.trim();
		try {
			const currUser = await db.get("SELECT name FROM users WHERE id=?", [req.params.id]);
			if (currUser.name.trim() === name)
				return reply.code(409).send({ error: "USERNAME ALREADY EXISTS" });
			await db.run(
				"UPDATE users SET name=? WHERE id=?",
				[name, req.params.id]
			);
			return reply.code(200).send({ name: name });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.put("/users/:id/email", async (req, reply) => {
		const { email: rawEmail } = req.body;
		const email = rawEmail.trim();
		const SECRET_SALT = await getVaultSecret("user-profile/config", "SECRET_SALT");
		const newHashedEmail = crypto.createHash('sha256').update(email + SECRET_SALT).digest('hex');
		try {
			const currHashedEmail = await db.get("SELECT email FROM users WHERE id=?", [req.params.id]);
			if (currHashedEmail.email.trim() === newHashedEmail)
				return reply.code(409).send({ error: "EMAIL ALREADY EXISTS" });
			await db.run(
				"UPDATE users SET email=? WHERE id=?",
				[newHashedEmail, req.params.id]
			);
			return reply.code(200).send({ email: email });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.put("/users/:id/password", async (req, reply) => {
		const { password } = req.body;
		try {
			const user = await db.get( "SELECT password FROM users WHERE id=?", [req.params.id] );
			const samePassword = await argon2.verify(user.password, password);
			if (samePassword)
				return reply.code(409).send({ error: "PASSWORD ALREADY EXISTS" });
			const hashed_password = await argon2.hash(password);
			await db.run(
				"UPDATE users SET password=? WHERE id=?",
				[hashed_password, req.params.id]
			);
			return reply.code(200).send({ msg: "PASSWORD UPDATED"});
		} catch (err) {
			fastify.log.error(err);
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
