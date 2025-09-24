import StatsBar from "./StatsBar";
import HealthSource from "../../../assets/icons/health.svg";
import StrengthSource from "../../../assets/icons/strength.svg";
import IntelligenceSource from "../../../assets/icons/intelligence.svg";
import PqSource from "../../../assets/icons/pq.svg";
import "../../../styles/board/sidebar-user/StatsGraph.css";

export default function StatsGraph() {
	//getRandomValues() from db;

	return (
		<div className="stats-graph">
			<StatsBar iconUrl={HealthSource} value={100} />
			<StatsBar iconUrl={StrengthSource} value={50} />
			<StatsBar iconUrl={IntelligenceSource} value={50} />
			<StatsBar iconUrl={PqSource} value={1} />
		</div>
	);
}