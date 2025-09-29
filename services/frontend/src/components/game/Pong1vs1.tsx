import Avatar1Src from "../../assets/avatars/rick.png";
import Avatar2Src from "../../assets/avatars/poopy.png";
import Scores from "./Scores";
import Arena from "./Arena";
import type { Pong1vs1Props } from "../../interfaces/Pong1vs1";
import usePadsMove from "../../hooks/usePadsMove";

// /game/1vs1
export default function Pong1vs1(props: Pong1vs1Props) {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'o', downKey: 'l' };
	const { pad1Pos, pad2Pos } = usePadsMove(ctrl1, ctrl2, undefined, undefined);
	const { words } = props;

	return (
		<div className="pong">
			<Scores avatar={Avatar1Src} name={"ttaquet"} result={6} ctrl={ctrl1} is2vs2={false} words={words} />
			<Arena pad1Pos={pad1Pos} pad2Pos={pad2Pos} />
			<Scores avatar={Avatar2Src} name={"ndavenne"} result={4} ctrl={ctrl2} is2vs2={false} words={words} />
		</div>
	);
}
