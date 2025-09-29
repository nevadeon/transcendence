import type { StatsProps } from "../../../interfaces/Stats.ts";
import MeeseeksSrc from "../../../assets/avatars/meeseeks.png";
import SquanchySrc from "../../../assets/avatars/squanchy.png";
import PoopySrc from "../../../assets/avatars/poopy.png";
import MortySrc from "../../../assets/avatars/morty.png";
import "../../../styles/board/body-games/Stats.css";

// curr.user === score1 + 4 <tr> max, then scrollbar !!!
const games = [
	{
		id: 1,
		mode: "1vsIA",
		scores: { score1: 7, score2: 2 },
		opponent1: { avatar: MeeseeksSrc, username: "Mr.Meeseeks" },
		date: "10-09-2025"
	},
	{
		id: 2,
		mode: "2vs2",
		scores: { score1: 7, score2: 0 },
		opponent1: { avatar: PoopySrc, username: "pamallet" },
		opponent2: { avatar: SquanchySrc, username: "agilles" },
		ally: { avatar: MortySrc, username: "ttaquet" },
		date: "10-09-2025"
	},
	{
		id: 3,
		mode: "1vs1",
		scores: { score1: 6, score2: 7 },
		opponent1: { avatar: PoopySrc, username: "pamallet" },
		date: "10-09-2025"
	},
	{
		id: 4,
		mode: "Tournament",
		scores: { score1: 7, score2: 5 },
		opponent1: { avatar: MortySrc, username: "ttaquet" },
		date: "09-09-2025"
	},
];

interface ModeStats {
    mode: string;
    wins: number;
    loses: number;
};

type StatsByMode = { [key: string]: ModeStats };

export default function Stats(props: StatsProps) {
	const { words } = props;

	const statsByMode = games.reduce((acc: StatsByMode, curr) => {
		const mode = curr.mode;
		if (!acc[mode])
			acc[mode] = { mode: mode, wins: 0, loses: 0 };
		if (curr.scores.score1 > curr.scores.score2)
			acc[mode].wins += 1;
		else if (curr.scores.score1 < curr.scores.score2)
			acc[mode].loses += 1;
		return acc;
	}, {});

	const computedGames = Object.values(statsByMode).map((stats, index) => ({
		id: index + 1,
		...stats,
	}));

	return (
		<div className="stats">
			<h2>{words.messages.statistics.title}</h2>
			<div className="stats-data">
				<table className="stats-data-table">
					<thead>
						<tr>
							<th>
								{words.messages.statistics.table.modes}
							</th>
							<th>
								{words.messages.statistics.table.scores}
							</th>
							<th>
								{words.messages.statistics.table.opponents}
							</th>
							<th>
								{words.messages.statistics.table.ally}
							</th>
							<th>
								{words.messages.statistics.table.date}
							</th>
						</tr>
					</thead>
					{/* See Trans3 in Gemini paulhavre42 account
						<div className="scroll-wrapper">
							<table className="body-table">
								tbody
							</table>
						</div>
					*/}
					<tbody>
						{games.map((game) => (
							<tr key={game.id}>
								<td> {game.mode} </td>
								<td> {game.scores.score1} - {game.scores.score2} </td>
								<td>
									<div className="opponents-container">
										<div className="opponent1">
											<img src={game.opponent1.avatar} alt="Opponent Avatar" />
											<span> {game.opponent1.username} </span>
										</div>
										{
											game.opponent2 &&
											(
												<div className="opponent2">
													<span>+</span>
													<img src={game.opponent2.avatar} alt="Opponent2 Avatar" />
													<span> {game.opponent2.username} </span>
												</div>
											)
										}
									</div>
								</td>
								<td>
									{
										game.ally ?
										(
											<div>
												<img src={game.ally.avatar} alt="Ally Avatar" />
												<span> {game.ally.username} </span>
											</div>
										) : "none"
									}
								</td>
								<td> {game.date} </td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="stats-data-cards">
					{computedGames.map((game) => (
						<div key={game.id} className={"card-container"}>
							<h3>{game.mode.toUpperCase()}</h3>
							<div className="card-container-totals">
								<div className="wins">
									<span>{game.wins < 10 ? "0" + game.wins : game.wins}</span>
									<span>{words.messages.statistics.cards["1vs1"].wins}</span>
								</div>
								<div className="loses">
									<span>{game.loses < 10 ? "0" + game.loses : game.loses}</span>
									<span>{words.messages.statistics.cards["1vs1"].loses}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}