import "../styles/billiard/billiard.css";

export default function billiard() {

	// #TODO useNavigate after received game results

	return (
		<div className="billiard-container">
			<iframe
				title="billiard Game"
				src="/billiard_game/index.html"
				className="billiard-iframe"
				allowFullScreen
			/>
		</div>
	);
}