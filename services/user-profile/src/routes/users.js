async function userRoutes(fastify) {
	const { db } = fastify;

	fastify.get("/users", async () => {
		return await db.all("SELECT * FROM users");
	});

	fastify.get("/users/:id", async (req, reply) => {
		const user = await db.get("SELECT * FROM users WHERE id = ?", [req.params.id]);
		if (!user) return reply.code(404).send({ error: "User not found" });
		return user;
	});

	fastify.put("/users/:id", async (req, reply) => {
		const { name, email } = req.body;
		const result = await db.run(
			"UPDATE users SET name=?, email=? WHERE id=?",
			[name, email, req.params.id]
		);
		if (result.changes === 0) return reply.code(404).send({ error: "User not found" });
		return { id: req.params.id, name, email };
	});

	fastify.delete("/users/:id", async (req, reply) => {
		const result = await db.run("DELETE FROM users WHERE id=?", [req.params.id]);
		if (result.changes === 0) return reply.code(404).send({ error: "User not found" });
		return { message: "Deleted successfully" };
	});
}

export default userRoutes;
