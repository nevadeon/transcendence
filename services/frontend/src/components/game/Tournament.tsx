import ProfileCard from "../board/sidebar-user/ProfileCard";
import WinnerCard from "./WinnerCard";
import AvatarSrc from "../../assets/avatars/rick.png";
import Avatar2Src from "../../assets/avatars/morty.png";
import Avatar3Src from "../../assets/avatars/squanchy.png";
import Avatar4Src from "../../assets/avatars/poopy.png";
import "../../styles/tournament/Tournament.css";

// /tournament
export default function Tournament() {
	return (
		<div className="tournament-board">
			<div className="demis">
				<div className="match">
					<ProfileCard id={1} avatar={AvatarSrc} username="ttaquet" ingame={true} isElim={true} />
					<ProfileCard id={1} avatar={Avatar2Src} username="agilles" ingame={true} isElim={false} />
				</div>
				<div className="match">
					<ProfileCard id={1} avatar={Avatar3Src} username="ndavenne" ingame={true} isElim={true} />
					<ProfileCard id={1} avatar={Avatar4Src} username="bchedru" ingame={true} isElim={false} />
				</div>
			</div>
			<div className="finals">
				<div className="match">
					<ProfileCard id={1} avatar={Avatar2Src} username="agilles" ingame={true} isElim={true} />
					<ProfileCard id={1} avatar={Avatar4Src} username="bchedru" ingame={true} isElim={false} />
				</div>
				{/* <EmptyCard />
				<EmptyCard /> */}
			</div>
			<div className="winner">
				{/* <ProfileCard id={1} avatar={Avatar4Src} username="bchedru" ingame={true} isElim={false} /> */}
				<WinnerCard />
				{/* <EmptyWinner /> */}
			</div>
		</div>
	);
}