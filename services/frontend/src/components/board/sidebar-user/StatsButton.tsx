import useBoard from "../../../hooks/useBoard";
import "../../../styles/board/sidebar-user/StatsButton.css";

export default function StatsButton() {
	const { toggleElement } = useBoard();

	return (
		<button className="stats-btn" onClick={() => toggleElement('stats')}>
			STATISTICS
		</button>
	);
}