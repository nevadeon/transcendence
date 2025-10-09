import { useState, useEffect, useMemo } from "react";
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

export interface TotalStatsProps {
	versus: number,
	versus_wins: number,
	versus_losses: number,
	versusCoop: number,
	versusCoop_wins: number,
	versusCoop_losses: number,
	versusIa: number,
	versusIa_wins: number,
	versusIa_losses: number,
	tournament: number,
	tournament_wins: number,
	tournament_losses: number,
	billard: number,
	billard_wins: number,
	billard_losses: number
}

interface ModeStats {
  mode: string; // Ex: 'Versus', 'Tournoi'
  total: number;
  wins: number;
  losses: number;
}

export default function Stats(props: StatsProps) {
	const [ gameHistory, setGameHistory ] = useState<GamesProps[]>([]);
	const [ userStats, setUserStats ] = useState<TotalStatsProps[]>([]);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const { openElement, toggleElement } = useBoard();
	const { user, token } = useAuth();
	const isOpen = openElement === 'stats';
	const { words } = props;
	gameHistory;
	isLoading;
	const rawStats = userStats?.[0];

	const statsForMapping = useMemo(() => {
		if (!rawStats) return [];
		return transformStats(rawStats);
	}, [rawStats]);

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
					setGameHistory(data.matches);
				} else {
					console.error('Failed to retreive all users: ', data.message);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}

		async function allStats() {
			setIsLoading(true);
			try {
				const res = await fetch(`http://localhost:3002/users_stats/${user.name}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});
				const data = await res.json();
				console.log("data: ", data);
				if (res.ok) {
					setUserStats(data.stats);
				} else {
					console.error('Failed to retreive all users: ', data.message);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}

		if (isOpen) {
			allGames();
			allStats();
		}
	}, [isOpen, token, user]);

	function transformStats(stats: any): ModeStats[] {
	// Définir les préfixes de modes de jeu (le nom de la carte)
		const modePrefixes = [
			'versus',
			'versusCoop',
			'versusIa',
			'tournament',
			'billard',
		];

		const transformedArray: ModeStats[] = [];
			for (const prefix of modePrefixes) {
				const totalKey = prefix; // Ex: 'versus'
				const winsKey = `${prefix}_wins`; // Ex: 'versus_wins'
				const lossesKey = `${prefix}_losses`; // Ex: 'versus_losses'

				if (stats[totalKey] !== undefined) {
				transformedArray.push({
					mode: prefix.charAt(0).toUpperCase() + prefix.slice(1), 
					total: stats[totalKey] as number,
					wins: stats[winsKey] as number,
					losses: stats[lossesKey] as number,
				});
			}
		}
		return transformedArray;
	}

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
						{gameHistory.slice(0, 3).map((game) => (
							<tr key={game.id}>
								<td> {game.mode} </td>
								<td> {game.left_team_score} - {game.right_team_score} </td>
								<td>
									<div className="opponents-container">
										<div className="opponent1">
											<img src={`/avatars/${game.avatar_right_team_A}`} alt="Opponent Avatar" />
											<span> {game.right_team_A} </span>
										</div>
										{
											game.right_team_B && game.avatar_right_team_B &&
											(
												<div className="opponent2">
													<span>+</span>
													<img src={`/avatars/${game.avatar_right_team_B}`} alt="Opponent2 Avatar" />
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
												<img src={`/avatars/${game.avatar_left_team_B}`} alt="Ally Avatar" />
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
				<div className="stats-data-cards">
					{statsForMapping.map((stat) => (
						<div key={stat.mode} className={"card-container"}>
							<h3>{stat.mode}</h3>
							<div className="card-container-totals">
								<div className="wins">
									<span>{stat.wins < 10 ? "0" + stat.wins : stat.wins}</span>
									<span>{words.messages.statistics.cards["1vs1"].wins}</span>
								</div>
								<div className="loses">
									<span>{stat.losses < 10 ? "0" + stat.losses : stat.losses}</span>
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