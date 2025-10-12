// import ProfileCard from "../board/sidebar-user/ProfileCard";
// import WinnerCard from "./WinnerCard";
import useTournament from "../../contexts/tournament/useTournament";
import type { TournamentProps } from "../../interfaces/Tournament";
import "../../styles/tournament/Tournament.css";
import { useAuth } from "../../contexts/auth/useAuth";

// /tournament
export default function Tournament(props: TournamentProps) {
	const { tournament } = useTournament();
	const { words } = props;
	words

	const challengers = tournament?.results?.challengers;
	console.log("challengers in Tournament.tsx: ", challengers);
	//<EmptyCard /> to design for finals and winner

	return (
		<div className="tournament-board">
			<div className="demis">
				<div className="match">
					{/* <ProfileCard id={1} avatar={challengers?.[0]?.avatar} username={challengers?.[0].name ? challengers?.[0].name : "?????"} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={true} words={words} />
					<div className="progressive-line-demis player1 top invisible"></div>
					<ProfileCard id={1} avatar={challengers?.[1]?.avatar} username={challengers?.[1].name ? challengers?.[1].name : "?????"} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={false} words={words} />
					<div className="progressive-line-demis player2 top"></div> */}
				</div>
				<div className="match">
					{/* <ProfileCard id={1} avatar={challengers?.[2]?.avatar} username={challengers?.[2].name ? challengers?.[2].name : "?????"} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={true} words={words} />
					<div className="progressive-line-demis player3 bot invisible"></div>
					<ProfileCard id={1} avatar={challengers?.[3]?.avatar} username={challengers?.[3].name ? challengers?.[3].name : "?????"} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={false} words={words} />
					<div className="progressive-line-demis player4 bot"></div> */}
				</div>
			</div>
			{/* <Empty Finals /> based on tournament.results */}
			<div className="finals">
				<div className="match">
					{/* <ProfileCard id={1} avatar={challengers?.[0]?.avatar} username={challengers?.[0].name ? challengers?.[0].name : "?????"} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={true} words={words} />
					<div className="progressive-line-finals player1-game3 mid invisible"></div>
					<ProfileCard id={1} avatar={challengers?.[3]?.avatar} username={challengers?.[3].name ? challengers?.[3].name : "?????"} planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={false} words={words} />
					<div className="progressive-line-finals player2-game3 mid"></div> */}
				</div>
			</div>
			<div className="winner">
				{/* <WinnerCard words={words} /> */}
				{/* <EmptyWinner /> */}
			</div>
		</div>
	);
}