import ArenaSrc from "../../assets/game/arena.svg";
import PadSrc from "../../assets/game/pad.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";

export default function Arena(props: any) {
	const { pad1Pos, pad2Pos } = props;

	return (
		<div className="pong-1vs1-arena">
			<img src={ArenaSrc} alt="Arena Image" className="pong-1vs1-arena-zone" />
			<div className="pong-1vs1-arena-playzone">
				<img src={PadSrc} alt="Pad Image" className="pad left" style={{transform: `translateY(${pad1Pos - 50}%)`}} />
				<img src={BallSrc} alt="Morty Ball" className="ball" />
				<img src={PadSrc} alt="Pad Image" className="pad" style={{transform: `translateY(${pad2Pos - 50}%)`}} />
			</div>
		</div>
	);
}