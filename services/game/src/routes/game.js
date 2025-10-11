// gameRoutes.js
async function gameRoutes(fastify) {
    const { db } = fastify;

    fastify.get("/match_history/:username", async (req, reply) => {
		const { username } = req.params;
		console.log(username);
		try {
			// try to delete useless 3x OR
			const matches = await db.all(`
				SELECT * FROM match_history
				WHERE left_team_A = ?
					OR left_team_B = ?
					OR right_team_A = ?
					OR right_team_B = ?
				ORDER BY date DESC
				`, [username, username, username, username]
			);
			return reply.code(201).send({
                matches: matches,
                message: "Successfully get last 4 games from game_history" });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ message: "Failed to get match history."})
		}
	});

	fastify.get("/users_stats/:username", async (req, reply) => {
		const { username } = req.params;
		console.log(username);
		try {
			const stats = await db.all(`
				SELECT versus, versus_wins, versus_losses,
				versusCoop, versusCoop_wins, versusCoop_losses,
				versusIa, versusIa_wins, versusIa_losses,
				tournament, tournament_wins, tournament_losses,
				billard, billard_wins, billard_losses FROM users_stats
				WHERE name=?
				`, [username]
			);
			return reply.code(201).send({
                stats: stats,
                message: "Successfully get totals from users_stats" });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ message: "Failed to get user's stats."})
		}
	});
}

export default gameRoutes;