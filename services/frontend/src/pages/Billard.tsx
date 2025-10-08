import "../styles/billard/Billard.css";

export default function Billard() {

	// #TODO useNavigate after received game results

	return (
		<div className="billard-container">
			<iframe
				title="Billard Game"
				src="/billard_game/index.html"
				className="billard-iframe"
				allowFullScreen
			/>
		</div>
	);
}