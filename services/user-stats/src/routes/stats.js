async function statsRoutes(fastify) {
	const { db } = fastify;

	// stats
	fastify.post("/game_history", async (req, reply) => {
		const {
			red_team_A,
			red_team_B,
			blue_team_A,
			blue_team_B,
			mode,
			red_team_score,
			blue_team_score,
			winner } = req.body;
		try {
			await db.run(
				"INSERT INTO match_history(red_team_A, red_team_B, blue_team_A, blue_team_B, mode, red_team_score, blue_team_score, winner) VALUES(?, ?, ?, ?, ?, ?, ?)",
				[red_team_A, red_team_B, blue_team_A, blue_team_B, mode, red_team_score, blue_team_score, winner]
			);

			const players = [red_team_A, red_team_B, blue_team_A, blue_team_B];

			for (const playerId in players) {
				await db.run ("UPDATE user_stats SET games = games + 1 WHERE name = ? AND SET ? = ? + 1 WHERE name = ?",
				[playerId], [mode], [mode], [playerId]);
			
				if (winner === 'red' && (playerId === red_team_A || playerId === red_team_B) ||
					winner === 'blue' && (playerId === blue_team_A || playerId === blue_team_B) ) {
					await db.run (`
						UPDATE users_stats SET wins = wins + 1 WHERE name = ? AND SET ?_win = ?_win + 1 WHERE name = ?
						`, [playerId], [mode], [mode], [playerId]);
				}
			}
			reply.code(201).send({ success: TextTrackCue, message: "match Recorded Succesfully." });
		} catch (err) {
			fastify.log(err);
			reply.code(500).send({ error: "Failed to record match." });
		}
	})
}