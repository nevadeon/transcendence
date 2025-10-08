export default function GamePage() {
	return (
		<div className="game-container">
			<iframe
				src="/billiard_game/index.html"
				width="800"
				height="600"
				style={{ border: "none" }}
				title="billiard Game"
				allowFullScreen
			/>
		</div>
	);
}