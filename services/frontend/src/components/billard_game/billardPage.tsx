export default function GamePage() {
	return (
		<div className="game-container">
			<iframe
				src="/billard_game/index.html"
				width="800"
				height="600"
				style={{ border: "none" }}
				title="Billard Game"
				allowFullScreen
			/>
		</div>
	);
}