import "../styles/billard/Billard.css";

const Billard: React.FC = () => {
	return (
		<div className="billiard-container">
			<iframe
				src="/billiard_game/index.html"
				className="billiard-frame"
				allowFullScreen
				title="billiard"
			/>
		</div>
	);
};

export default Billard;