import ProfileCard from "../board/sidebar-user/ProfileCard";
import WinnerCard from "./WinnerCard";
import type { TournamentProps } from "../../interfaces/Tournament";
import AvatarSrc from "../../../public/avatars/defaults/rick.png";
import Avatar2Src from "../../../public/avatars/defaults/morty.png";
import Avatar3Src from "../../../public/avatars/defaults/spaceMorty.png";
import Avatar4Src from "../../../public/avatars/defaults/spaceMorty.png";
import "../../styles/tournament/Tournament.css";

// /tournament
export default function Tournament(props: TournamentProps) {
	const { users, winnerA, winnerB, words } = props;

	//<EmptyCard /> to design for finals and winner
	return (
		<div className="tournament-board">
			<div className="demis">
				<div className="match">
					<ProfileCard id={1} avatar={AvatarSrc} username="ttaquet" planet="Mars" species="blikon" dimension="Ici"  ingame={true} isElim={true} words={words} />
					<div className="progressive-line-demis player1 top invisible"></div>
					<ProfileCard id={1} avatar={Avatar2Src} username={users[0].length !== 0 ? users[0] : ""} planet="Mars" species="blikon" dimension="Ici"  ingame={true} isElim={false} words={words} />
					<div className="progressive-line-demis player2 top"></div>
				</div>
				<div className="match">
					<ProfileCard id={1} avatar={Avatar3Src} username={winnerA.length !== 0 ? winnerA : ""} planet="Mars" species="blikon" dimension="Ici"  ingame={true} isElim={true} words={words} />
					<div className="progressive-line-demis player3 bot invisible"></div>
					<ProfileCard id={1} avatar={Avatar4Src} username={winnerB.length !== 0 ? winnerA : ""} planet="Mars" species="blikon" dimension="Ici"  ingame={true} isElim={false} words={words} />
					<div className="progressive-line-demis player4 bot"></div>
				</div>
			</div>
			<div className="finals">
				<div className="match">
					<ProfileCard id={1} avatar={Avatar2Src} username="agilles" planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={true} words={words} />
					<div className="progressive-line-finals player1-game3 mid invisible"></div>
					<ProfileCard id={1} avatar={Avatar4Src} username="bchedru" planet="testbis" species="bonkou" dimension="test"  ingame={true} isElim={false} words={words} />
					<div className="progressive-line-finals player2-game3 mid"></div>
				</div>
			</div>
			<div className="winner">
				{/* <ProfileCard id={1} avatar={Avatar4Src} username="bchedru" ingame={true} isElim={false} /> */}
				<WinnerCard words={words} />
				{/* <EmptyWinner /> */}
			</div>
		</div>
	);
}