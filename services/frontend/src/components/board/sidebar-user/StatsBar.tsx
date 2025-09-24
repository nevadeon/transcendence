import type { StatsBarProps } from "../../../interfaces/StatsBar";
import "../../../styles/board/sidebar-user/StatsBar.css";

export default function StatsBar(props: StatsBarProps) {
	const { iconUrl, value } = props;
	const percent = (value / 100) * 100;

	return (
		<div className="stats-bar">
			<div className="stats-bar-frame">
				<div className="stats-bar-fill" style={{ height: `${percent}%`}}></div>
			</div>
			<img src={iconUrl} alt="Health Icon" />
		</div>
	);
}