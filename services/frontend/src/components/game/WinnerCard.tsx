import type { WinnerCardProps } from "../../interfaces/WinnerCard";
import AvatarSrc from "../../../public/avatars/defaults/spaceMorty.png";
import "../../styles/tournament/WinnerCard.css";

export default function WinnerCard(props: WinnerCardProps) {
	const { words } = props;

	return (
		<div className="winner-card">
			<span>{words.messages.tournament.winner}</span>
			<img src={AvatarSrc} alt="Winner Portrait" />
		</div>
	);
}