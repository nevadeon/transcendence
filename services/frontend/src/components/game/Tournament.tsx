import ProfileCard from "../board/sidebar-user/ProfileCard";
import WinnerCard from "./WinnerCard";
import useTournament from "../../contexts/tournament/useTournament";
import type { TournamentProps } from "../../interfaces/Tournament";
import "../../styles/tournament/Tournament.css";
import { useAuth } from "../../contexts/auth/useAuth";

// /tournament
export default function Tournament(props: TournamentProps) {
	const { tournament } = useTournament();
	const { words } = props;
	words

	const challengers = tournament?.results?.challengers; //[x3 inputs] || [x4 inputs]
	const matches = tournament?.results?.matches; //[x3, 'demi1'...]
	console.log("challengers in Tournament.tsx after calling tournament: ", challengers);
	//<EmptyCard /> to design for finals and winner

	return (
		<div className="tournament-board">
			<div className="demis">
				<div className="match">
					<ProfileCard id={1} avatar={matches?.[0]?.opponents?.[0].avatar} username={matches?.[0]?.opponents?.[0].name ? matches?.[0]?.opponents?.[0].name : undefined} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={matches?.[0].winnerId === 2 ? true : false} words={words} />
					<div className={matches?.[0].winnerId === 1 ? "progressive-line-demis player1 top" : "progressive-line-demis player1 top invisible"}></div>
					<ProfileCard id={1} avatar={matches?.[0]?.opponents?.[1].avatar} username={matches?.[0]?.opponents?.[1].name ? matches?.[0]?.opponents?.[1].name : undefined} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={matches?.[0].winnerId === 1 ? true : false} words={words} />
					<div className={matches?.[0].winnerId === 2 ? "progressive-line-demis player2 top" : "progressive-line-demis player2 top invisible"}></div>
				</div>
				<div className="match">
					<ProfileCard id={1} avatar={matches?.[1]?.opponents?.[0].avatar} username={matches?.[1]?.opponents?.[0].name ? matches?.[1]?.opponents?.[0].name : undefined} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={matches?.[1].winnerId === 2 ? true : false} words={words} />
					<div className={matches?.[1].winnerId === 1 ? "progressive-line-demis player3 bot" : "progressive-line-demis player3 bot invisible"}></div>
					<ProfileCard id={1} avatar={matches?.[1]?.opponents?.[1].avatar} username={matches?.[1]?.opponents?.[1].name ? matches?.[1]?.opponents?.[1].name : undefined} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={matches?.[1].winnerId === 1 ? true : false} words={words} />
					<div className={matches?.[1].winnerId === 2 ? "progressive-line-demis player4 bot" : "progressive-line-demis player4 bot invisible"}></div>
				</div>
			</div>
			<div className="finals">
				<div className="match">
					<ProfileCard id={1} avatar={matches?.[2]?.opponents?.[0].avatar} username={matches?.[2]?.opponents?.[0].name ? matches?.[2]?.opponents?.[0].name : undefined} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={matches?.[2].winnerId === 2 ? true : false} words={words} />
					<div className={matches?.[2].winnerId === 1 ? "progressive-line-finals player1-game3 mid" : "progressive-line-finals player1-game3 mid invisible"}></div>
					<ProfileCard id={1} avatar={matches?.[2]?.opponents?.[1].avatar} username={matches?.[2]?.opponents?.[1].name ? matches?.[2]?.opponents?.[1].name : undefined} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={matches?.[2].winnerId === 1 ? true : false} words={words} />
					<div className={matches?.[2].winnerId === 2 ? "progressive-line-finals player2-game3 mid" : "progressive-line-finals player2-game3 mid invisible"}></div>
				</div>
			</div>
			<div className="winner">
				{
					matches?.[2]?.winnerId === 1
						? <WinnerCard avatar={matches?.[2]?.opponents?.[0].avatar} username={matches?.[2]?.opponents?.[0].name} words={words} />
						: <WinnerCard avatar={matches?.[2]?.opponents?.[1].avatar} username={matches?.[2]?.opponents?.[1].name} words={words} />
				}
			</div>
		</div>
	);
}