async function userRoutes(fastify) {
	const { db } = fastify;

	fastify.get("/users/:id/", async (req, reply) => {
		const { id } = req.body;
		const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
		if (!user) return reply.code(404).send({ error: "User not found" });
		return reply.code(201).send({user: user});
	});

	fastify.put("/users/:id/name", async (req, reply) => {
		const { name, id } = req.body;
		try {
			const result = await db.run(
				"UPDATE users SET name=?, WHERE id=?",
				[name, id]
			);
			if (result.changes === 0)
				return reply.code(404).send({ error: "Username has not change." });
			return reply.code(201).send({ name: name });
		} catch (err) {
			fastify.log.error(err);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.name')) {
					return reply.code(409).send({ 
						error: "Username already exists",
						field: "name"
					});
				}
			}
			return reply.code(500).send(err);
		}
	});

	fastify.put("/users/:id/email", async (req, reply) => {
		const { email, id} = req.body;
		try {
			const result = await db.run(
				"UPDATE users SET email=?, WHERE id=?",
				[email, id]
			);
			if (result.changes === 0)
				return reply.code(404).send({ error: "Email has not change." });
			return reply.code(201).send({ email: email });
		} catch (err) {
			fastify.log.error(err);
			if (err.message.includes('UNIQUE constraint failed')) {
				if (err.message.includes('users.email')) {
					return reply.code(409).send({ 
						error: "Email already exists",
						field: "email"
					});
				}
			}
			return reply.code(500).send(err);
		}
	});

	fastify.put("/users/:id/password", async (req, reply) => {
		const { password, id } = req.body;
		try {
			const user = await db.get(
				"SELECT password FROM users WHERE id = ?",
				[id]
			);
			const test = await argon2.verify(user.password, password);
			if (test)
				return reply.code(404).send({ error: "Password has not change." });

			const hashed_password = await argon2.hash(password);
			await db.run(
				"UPDATE users SET password = ? WHERE id = ?", [hashed_password, id]
			);
			return reply.code(201);
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send(err);
		}
	});

		fastify.put("/users/:id/two_factor", async (req, reply) => {
		const { id } = req.body;
		try {
			const two_factor = await db.get(
				"SELECT two_factor FROM users WHERE ID = ?", [id]
			);
			two_factor = (!(two_factor === 1));
			const result = await db.run(
				"UPDATE users SET two_factor=?, WHERE id=?",
				[two_factor, id]
			);
			return reply.code(201).send({ two_factor: two_factor });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send(err);
		}
	});


	fastify.delete("/users/:id", async (req, reply) => {
		const { id } = req.body;
		const result = await db.run("DELETE FROM users WHERE id=?", [id]);
		if (result.changes === 0) return reply.code(404).send({ error: "User not found" });
		return { message: "Deleted successfully" };
	});
}

export default userRoutes;
