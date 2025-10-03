import { useLocation } from "react-router";
import Avatar1Src from "../../../public/avatars/defaults/rick.png";
import Avatar2Src from "../../../public/avatars/defaults/poopy.png";
import Avatar3Src from "../../../public/avatars/defaults/morty.png";
import Avatar4Src from "../../../public/avatars/defaults/squanchy.png";
import Scores from "./Scores";
import DuoArenaSource from "../../assets/game/2vs2-terrain.svg";
import ThinPadSource from "../../assets/game/thin-pad.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";
import usePadsMove from "../../hooks/usePadsMove";
import type { Pong2vs2Props } from "../../interfaces/Pong2vs2";

// /game/2vs2
export default function Pong2vs2(props: Pong2vs2Props) {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'f', downKey: 'v' };
	const ctrl3 = { upKey: 'k', downKey: 'm' };
	const ctrl4 = { upKey: '\'', downKey: ']' };
	const { pad1Pos, pad2Pos, pad3Pos, pad4Pos } = usePadsMove(ctrl1, ctrl2, ctrl3, ctrl4);
	const { words } = props;
	const location = useLocation();

	return (
		<div className="pong">
			<Scores
				avatar={Avatar1Src}
				avatar2={Avatar2Src}
				name={"ttaquet"}
				name2={location.state.usernames[0]}
				result={6}
				ctrl={ctrl1}
				ctrl2={ctrl2}
				is2vs2={true}
				words={words}
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
				name={location.state.usernames[1]}
				name2={location.state.usernames[2]}
				result={4}
				ctrl={ctrl3}
				ctrl2={ctrl4}
				is2vs2={true}
				words={words}
			/>
		</div>
	);
}
