import { useState, useEffect } from "react";
import useBoard from "../../../hooks/useBoard";
import { useAuth } from "../../../contexts/auth/useAuth.tsx";
import type { StatsProps } from "../../../interfaces/Stats.ts";
import CrossSrc from "../../../assets/icons/cross.svg";
import "../../../styles/board/body-games/Stats.css";

export interface GamesProps {
	id: number,
	left_team_A: string,
	avatar_left_team_A: string,
	left_team_B: string | null,
	avatar_left_team_B: string | null,
	right_team_A: string,
	avatar_right_team_A: string,
	right_team_B: string | null,
	avatar_right_team_B: string | null,
	mode: string,
	left_team_score: number,
	right_team_score: number,
	winnerId: number,
	date: string
}

export default function Stats(props: StatsProps) {
	const [ gameHistory, setGameHistory ] = useState<GamesProps[]>([]);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const { openElement, toggleElement } = useBoard();
	const { user, token } = useAuth();
	const isOpen = openElement === 'stats';
	const { words } = props;
	gameHistory;
	isLoading;

	useEffect(() => {
		if (!isOpen || !token || !user)
			return ;
		async function allGames() {
			setIsLoading(true);
			try {
				const res = await fetch(`http://localhost:3002/match_history/${user.name}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});
				const data = await res.json();
				console.log("data: ", data);
				if (res.ok) {
					setGameHistory(data);
				} else {
					console.error('Failed to retreive all users: ', data.message);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}
		if (isOpen)
			allGames();
	}, [isOpen, token, user]);

	// const statsByMode = games.reduce((acc: StatsByMode, curr) => {
	// 	const mode = curr.mode;
	// 	if (!acc[mode])
	// 		acc[mode] = { mode: mode, wins: 0, loses: 0 };
	// 	if (curr.scores.score1 > curr.scores.score2)
	// 		acc[mode].wins += 1;
	// 	else if (curr.scores.score1 < curr.scores.score2)
	// 		acc[mode].loses += 1;
	// 	return acc;
	// }, {});

	// const computedGames = Object.values(statsByMode).map((stats, index) => ({
	// 	id: index + 1,
	// 	...stats,
	// }));

	function handleClose() {
		toggleElement(null);
	}

	if (!isOpen)
		return null;

	if (isLoading)
		return "Loading history game...";

	return (
		<div className="stats">
			<div className="stats-header">
				<h2>{words.messages.statistics.title}</h2>
				<button className="modal-close-button" onClick={handleClose}>
					<img src={CrossSrc} alt="Close Icon" />
				</button>
			</div>
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
					<tbody>
						{gameHistory.map((game) => (
							<tr key={game.id}>
								<td> {game.mode} </td>
								<td> {game.left_team_score} - {game.right_team_score} </td>
								<td>
									<div className="opponents-container">
										<div className="opponent1">
											<img src={game.avatar_right_team_A} alt="Opponent Avatar" />
											<span> {game.right_team_A} </span>
										</div>
										{
											game.right_team_B && game.avatar_right_team_B &&
											(
												<div className="opponent2">
													<span>+</span>
													<img src={game.avatar_right_team_B} alt="Opponent2 Avatar" />
													<span> {game.right_team_B} </span>
												</div>
											)
										}
									</div>
								</td>
								<td>
									{
										game.left_team_B && game.avatar_left_team_B ?
										(
											<div>
												<img src={game.avatar_left_team_B} alt="Ally Avatar" />
												<span> {game.left_team_B} </span>
											</div>
										) : "none"
									}
								</td>
								<td> {game.date} </td>
							</tr>
						))} */}
					</tbody>
				</table>
				{/* <div className="stats-data-cards">
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
				</div> */}
			</div>
		</div>
	);
}