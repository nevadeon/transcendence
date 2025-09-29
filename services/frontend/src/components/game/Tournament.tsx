import ProfileCard from "../board/sidebar-user/ProfileCard";
import WinnerCard from "./WinnerCard";
import type { TournamentProps } from "../../interfaces/Tournament";
import AvatarSrc from "../../assets/avatars/rick.png";
import Avatar2Src from "../../assets/avatars/morty.png";
import Avatar3Src from "../../assets/avatars/squanchy.png";
import Avatar4Src from "../../assets/avatars/poopy.png";
import "../../styles/tournament/Tournament.css";

// /tournament
export default function Tournament(props: TournamentProps) {
	const { words } = props;

	return (
		<div className="tournament-board">
			<div className="demis">
				<div className="match">
					<ProfileCard id={1} avatar={AvatarSrc} username="ttaquet" ingame={true} isElim={true} words={words} />
					{/* <div className="progressive-line-demis player1 top"></div> */}
					<ProfileCard id={1} avatar={Avatar2Src} username="agilles" ingame={true} isElim={false} words={words} />
					<div className="progressive-line-demis player2 top"></div>
				</div>
				<div className="match">
					<ProfileCard id={1} avatar={Avatar3Src} username="ndavenne" ingame={true} isElim={true} words={words} />
					{/* <div className="progressive-line-demis player3 bot"></div> */}
					<ProfileCard id={1} avatar={Avatar4Src} username="bchedru" ingame={true} isElim={false} words={words} />
					<div className="progressive-line-demis player4 bot"></div>
				</div>
			</div>
			<div className="finals">
				<div className="match">
					<ProfileCard id={1} avatar={Avatar2Src} username="agilles" ingame={true} isElim={true} words={words} />
					{/* <div className="progressive-line-finals player1-game3 mid"></div> */}
					<ProfileCard id={1} avatar={Avatar4Src} username="bchedru" ingame={true} isElim={false} words={words} />
					<div className="progressive-line-finals player2-game3 mid"></div>
				</div>
				{/* <EmptyCard />
				<EmptyCard /> */}
			</div>
			<div className="winner">
				{/* <ProfileCard id={1} avatar={Avatar4Src} username="bchedru" ingame={true} isElim={false} /> */}
				<WinnerCard words={words} />
				{/* <EmptyWinner /> */}
			</div>
		</div>
	);
}