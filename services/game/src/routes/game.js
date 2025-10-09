// gameRoutes.js
async function gameRoutes(fastify) {
    const { db } = fastify;

    // fastify.post("/record_game", async (req, reply) => {
	// 	const {
	// 		left_team_A,
	// 		avatar_left_team_A,
	// 		left_team_B,
    //         avatar_left_team_B,
	// 		right_team_A,
    //         avatar_right_team_A,
	// 		right_team_B,
    //         avatar_right_team_B,
	// 		mode,
	// 		left_team_score,        //state.score.p1 = 1
	// 		right_team_score,       //state.score.p2 = 2
	// 		winnerId } = req.body;  //winnerId? (1(left, where loginUser always is) or 2(right))
	// 	try {
	// 		await db.run(
	// 			`INSERT INTO match_history(
    //                 left_team_A,
	// 		        avatar_left_team_A,
    //                 left_team_B,
	// 		        avatar_left_team_B,
    //                 right_team_A,
	// 		        avatar_right_team_A,
    //                 right_team_B,
	// 		        avatar_right_team_B,
    //                 mode,
    //                 left_team_score,
    //                 right_team_score,
    //                 winnerId)
    //                 VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //             `, [left_team_A,
    //                 avatar_left_team_A,
    //                 left_team_B,
    //                 avatar_left_team_B,
    //                 right_team_A,
    //                 avatar_right_team_A,
    //                 right_team_B,
    //                 avatar_right_team_B,
    //                 mode,
    //                 left_team_score,
    //                 right_team_score,
    //                 winnerId]
	// 		);

	// 		const playersNames = [left_team_A, left_team_B]; //login user always on left_team ! //, right_team_A, right_team_B];
	// 		const VALID_MODES = ['versus', 'versusCoop', 'versusIa', 'tournament', 'billard'];
	// 		if (!VALID_MODES.includes(mode))
	// 			throw new error(`Mode invalide: ${mode}`);

	// 		for (const playerName in playersNames) {
	// 			await db.run (`UPDATE users_stats SET games = games + 1, ${mode} = ${mode} + 1 WHERE name = ?`,  //check if works
	// 				[playerName]);

	// 			if (winnerId === 1 && (playerName === left_team_A || playerName === left_team_B) ||
	// 				winnerId === 2 && (playerName === right_team_A || playerName === right_team_B) ) {
	// 				await db.run (`UPDATE users_stats SET wins = wins + 1, ${mode}_win = ${mode}_win + 1 WHERE name = ?`,
	// 				[playerName]);
	// 			}
	// 		}
	// 		return reply.code(201).send({ message: "match Recorded Succesfully." });
	// 	} catch (err) {
	// 		fastify.log.error(err);
	// 		return reply.code(500).send({ message: "Failed to record match." });
	// 	}
	// });

    fastify.get("/match_history/:username", async (req, reply) => {
		const { username } = req.param.username;
		try {
			const matches = await db.get(`
				SELECT * FROM match_history
				WHERE left_team_A = ?
					OR left_team_B = ?
					OR right_team_A = ?
					OR right_team_B = ?
				ORDER BY date DESC
                LIMIT 4
				`, [username, username, username, username]
			);
			return reply.code(201).send({
                matches: matches,
                numMatches: matches.length,
                message: "Successfully get last 4 games from game_history" });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ message: "Failed to get match history."})
		}
	});
}

export default gameRoutes;