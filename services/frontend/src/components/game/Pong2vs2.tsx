import Avatar1Src from "../../assets/avatars/rick.png";
import Avatar2Src from "../../assets/avatars/poopy.png";
import Avatar3Src from "../../assets/avatars/morty.png";
import Avatar4Src from "../../assets/avatars/squanchy.png";
import Scores from "./Scores";
import DuoArenaSource from "../../assets/game/2vs2-terrain.svg";
import ThinPadSource from "../../assets/game/thin-pad.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";
import usePadsMove from "../../hooks/usePadsMove";

// /game/2vs2
export default function Pong2vs2() {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'f', downKey: 'v' };
	const ctrl3 = { upKey: 'k', downKey: 'm' };
	const ctrl4 = { upKey: '\'', downKey: ']' };
	const { pad1Pos, pad2Pos, pad3Pos, pad4Pos } = usePadsMove(ctrl1, ctrl2, ctrl3, ctrl4);

	return (
		<div className="pong">
			<Scores
				avatar={Avatar1Src}
				avatar2={Avatar2Src}
				name={"ttaquet"}
				name2={"ndavenne"}
				result={6}
				ctrl={ctrl1}
				ctrl2={ctrl2}
				is2vs2={true}
			/>
			<div className="pong-1vs1-arena">
				<img src={DuoArenaSource} alt="Arena Image" className="pong-1vs1-arena-zone" />
				<div className="pong-1vs1-arena-playzone double">
					<div className="duo">
						<img src={ThinPadSource} alt="Pad Image" className="pad left" style={{marginRight: "4px", transform: `translateY(${pad1Pos - 50}%)`}} />
						<img src={ThinPadSource} alt="Pad Image" className="pad left" style={{transform: `translateY(${pad2Pos - 50}%)`}} />
					</div>
					<img src={BallSrc} alt="Morty Ball" className="ball" />
					<div className="duo">
						<img src={ThinPadSource} alt="Pad Image" className="pad" style={{transform: `translateY(${pad3Pos - 50}%)`}} />
						<img src={ThinPadSource} alt="Pad Image" className="pad" style={{marginLeft: "4px", transform: `translateY(${pad4Pos - 50}%)`}} />
					</div>
				</div>
			</div>
			<Scores
				avatar={Avatar3Src}
				avatar2={Avatar4Src}
				name={"bchedru"}
				name2={"agilles"}
				result={4}
				ctrl={ctrl3}
				ctrl2={ctrl4}
				is2vs2={true}
			/>
		</div>
	);
}
