import type { WinnerCardProps } from "../../interfaces/WinnerCard";
// import AvatarSrc from "../../../public/avatars/defaults/spaceMorty.png";
import "../../styles/tournament/WinnerCard.css";

export default function WinnerCard(props: WinnerCardProps) {
	const { words, username, avatar } = props;

	return (
		<div className="winner-card">
            {username === undefined && <div className="Hide"></div>}
			<span>{words.messages.tournament.winner}</span>
			<img src={avatar} alt="Winner Portrait" />
		</div>
	);
}
