import HealthSource from "../assets/icons/health.svg";
import StrengthSource from "../assets/icons/strength.svg";
import IntelligenceSource from "../assets/icons/intelligence.svg";
import PqSource from "../assets/icons/pq.svg";
import "../styles/StatsGraph.css";

export default function StatsGraph() {
	//...

	return (
		<div className="stats-graph">
			<img src={HealthSource} alt="Health Icon" />
			<img src={StrengthSource} alt="Strength Icon" />
			<img src={IntelligenceSource} alt="Intelligence Icon" />
			<img src={PqSource} alt="Pq Icon" />
		</div>
	);
}