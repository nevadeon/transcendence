// gameRoutes.js
async function gameRoutes(fastify) {
	const { db } = fastify;

	fastify.get("/match_history/:id", async (req, reply) => {
		const { id } = req.params;
		try {
			// try to delete useless 3x OR
			const matches = await db.all(`
				SELECT * FROM match_history
				WHERE left_team_A = ?
					OR left_team_B = ?
					OR right_team_A = ?
					OR right_team_B = ?
				ORDER BY date DESC
				`, [id, id, id, id]
			);
			return reply.code(201).send({
				matches: Array(matches),
				message: "Successfully get last 4 games from game_history" });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ message: "Failed to get match history."})
		}
	});

	fastify.get("/users_stats/:id", async (req, reply) => {
		const { id } = req.params;
		try {
			const stats = await db.all(`
				SELECT versus, versus_wins, versus_losses,
				versusIa, versusIa_wins, versusIa_losses,
				tournament, tournament_wins, tournament_losses,
				billiard, billard_wins, billard_losses FROM users_stats
				WHERE id=?
				`, [id]
			);
			return reply.code(201).send({
				stats: Array(stats),
				message: "Successfully get totals from users_stats" });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ message: "Failed to get user's stats."})
		}
	});

	fastify.post("/users_stats/init/:id", async (req, reply) => {
		const { id } = req.params;

		try {
			const tmp = await db.get(
				`SELECT * FROM users_stats WHERE id = ?`,
				[id]
			);
			if (tmp) {
				return reply.code(205).send({ message: "Id already exist." });
			}
			await db.run(
				`INSERT INTO users_stats(id) VALUES(?)`,
				[id]
			);
			return reply.code(201);
		} catch (err) {
			console.log(err);
			return reply.code(500).send({ error : "err" });
		}
	})
}

export default gameRoutes;