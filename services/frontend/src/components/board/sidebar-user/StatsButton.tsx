import type { StatsButtonProps } from "../../../interfaces/StatsButton";
import "../../../styles/board/sidebar-user/StatsButton.css";

export default function StatsButton(props: StatsButtonProps) {
	const { words } = props;

	return (
		<button className="stats-btn">
			{words.messages.board.stats}
		</button>
	);
}