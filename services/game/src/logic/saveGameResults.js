
export async function saveGameResults(fastify, state, gameMode, mainPlayer, playersTemp) {
    const { db } = fastify;

	const { score } = state;
	const { name = null, avatar = "defaults/rick.png" } = mainPlayer || {}; //if mainPlayer = undefined
	const { usernames, avatars } = playersTemp;
	const winnerId = state.score.p1 > state.score.p2 ? 1 : 2;
	console.log(`\nscore P1: ${score.p1}
		\nscore P2: ${score.p2}
		\nmode: ${gameMode}
		\nmainPlayer name: ${mainPlayer.name}
		\nmainPlayer avatar: ${mainPlayer.avatar}
		\nplayersTemp 1 name: ${usernames[0]}
		\nplayersTemp 1 avatar: ${avatars[0]}
		\nwinnerId: ${winnerId}\n`);

	//if (mainPlayerName) = login, else playersTemp[4x]
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
			console.log("Successfully wrote 1vs1 in match_history");
            return { success: true };
		} catch (err) {
			console.error("Failed to record match in DB:", err);
            throw err;
		}
	} else if (mainPlayer && gameMode === "versusCoop") {
		try {
			await db.run(
				`INSERT INTO match_history(
					left_team_A,
					avatar_left_team_A,
					left_team_B,
					avatar_left_team_B,
					right_team_A,
					avatar_right_team_A,
					right_team_B,
					avatar_right_team_B,
					mode,
					left_team_score,
					right_team_score,
					winnerId)
					VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				`, [name,
					avatar,
					usernames[0],
					avatars[0],
					usernames[1],
					avatars[1],
					usernames[2],
					avatars[2],
					gameMode,
					score.p1,
					score.p2,
					winnerId]
			);
			console.log("Successfully wrote 2vs2 in match_history");
            return { success: true };
		} catch (err) {
			console.error("Failed to record match in DB:", err);
            throw err;
		}
	}
}