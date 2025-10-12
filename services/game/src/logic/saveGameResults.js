
export async function saveGameResults(fastify, state, gameMode, mainPlayer, playersTemp) {
    const { db } = fastify;

	const { score } = state;
	const { name = null, avatar = "defaults/rick.png", id = null} = mainPlayer || {}; //if mainPlayer = undefined
	const { usernames, avatars } = playersTemp;
	const winnerId = state.score.p1 > state.score.p2 ? 1 : 2;

	if (mainPlayer && gameMode === "versus") {
		try {
			await db.run(
				`INSERT INTO match_history(
					left_team_A,
					avatar_left_team_A,
					right_team_A,
					avatar_right_team_A,
					mode,
					left_team_score,
					right_team_score,
					winnerId)
					VALUES(?, ?, ?, ?, ?, ?, ?, ?)
				`, [name,
					avatar,
					usernames[0],
					avatars[0],
					gameMode,
					score.p1,
					score.p2,
					winnerId]
			);

			const VALID_MODES = ['versus', 'versusIa', 'tournament', 'billiard'];
			if (!VALID_MODES.includes(gameMode))
				throw new error(`Mode invalide: ${gameMode}`);

			await db.run (`
				UPDATE users_stats
				SET games = games + 1,
				${gameMode} = ${gameMode} + 1
				WHERE id = ?`,
			[id]);

			if (winnerId === 1) {
				await db.run (`
					UPDATE users_stats
					SET wins = wins + 1,
					${gameMode}_wins = ${gameMode}_wins + 1
					WHERE id = ?`,
				[id]);
			} else {
				await db.run (`
					UPDATE users_stats SET losses = losses + 1,
					${gameMode}_losses = ${gameMode}_losses + 1 WHERE id = ?`,
				[id]);
			console.log("\n\n", gameMode, "\n\n");
			}
			return { success: true };
		} catch (err) {
			console.error("Failed to record match in DB:", err);
			throw err;
		}}
		try {

			if (!VALID_MODES.includes(gameMode))
				throw new error(`Mode invalide: ${gameMode}`);

			await db.run (`
				UPDATE users_stats
				SET games = games + 1,
				${gameMode} = ${gameMode} + 1
				WHERE id = ?`,
			[id]);

			if (winnerId === 1) {
				await db.run (`
					UPDATE users_stats
					SET wins = wins + 1,
					${gameMode}_wins = ${gameMode}_wins + 1
					WHERE id = ?`,
				[id]);
			} else {
				await db.run (`
					UPDATE users_stats
					SET losses = losses + 1,
					${gameMode}_losses = ${gameMode}_losses + 1
					WHERE id = ?`,
				[id]);
			}
            return { success: true };
		} catch (err) {
			console.error("Failed to record match in DB:", err);
            throw err;
		}
	}