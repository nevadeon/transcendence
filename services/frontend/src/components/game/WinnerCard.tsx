import AvatarSrc from "../../assets/avatars/squanchy.png";
import "../../styles/tournament/WinnerCard.css";

export default function WinnerCard() {
	return (
		<div className="winner-card">
			<span>WINNER</span>
			<img src={AvatarSrc} alt="Winner Portrait" />
		</div>
	);
}