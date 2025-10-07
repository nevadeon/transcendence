async function statsRoutes(fastify) {
	const { player1, player2, player3, player4 } = fastify;

	const player = [player1, player2, player3, player4];

	async function selectPlayer() {
			if (player.length() === 1)
				return player[0];
			const temp =  player.indexOf(Math.floor(Math.random() * player.length));
			player.splice(temp, 1);
			return temp;
		}

	return {"matches": [
		{"player1": selectPlayer(), "player2": selectPlayer() },
		{"player1": selectPlayer(), "player2": selectPlayer() },
	]}
}

export default tournament;