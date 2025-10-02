async function statsRoutes(fastify) {
	const { db } = fastify;

	// stats
	fastify.post("/record_match", async (req, reply) => {
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
			fastify.log.error(err);
			reply.code(500).send({ error: "Failed to record match." });
		}
	})
	
	fastify.get("/game_history/:username", async (req, reply) => {
		const { username } = req.param.username;
		try {
			const matches = await db.get(`
				SELECT * FROM match_history 
				WHERE red_team_A = ? 
					OR red_team_B = ? 
					OR blue_team_A = ? 
					OR blue_team_B = ?
				ORDER BY date DESC
				`, [username, username, username, username]
			);

			reply.code(201).send({
				matches: matches,
				count: matchMedia.length
			});

		} catch (err) {
			fastify.log.error(err);
			reply.code(500).send({ error: "Failed to get match history."})
		}
	})
}