import "../styles/billard/Billard.css";

const Billard: React.FC = () => {
	return (
		<div className="billiard-container">
			<iframe
				src="/billiard_game/index.html"
				className="billiard-frame"
				allowFullScreen
				title="billard"
			/>
		</div>
	);
};

export default Billard;