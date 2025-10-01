// import { useLocation, useNavigate } from "react-router";
import Scores from "./Scores";
import Arena from "./Arena";
import usePadsMove from "../../hooks/usePadsMove";
import Avatar1Src from "../../assets/avatars/rick.png";
import Avatar2Src from "../../assets/avatars/poopy.png";
import type { Pong1vs1Props } from "../../interfaces/Pong1vs1";

// /game/1vs1
export default function Pong1vs1(props: Pong1vs1Props) {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'o', downKey: 'l' };
	const { pad1Pos, pad2Pos, ballPos } = usePadsMove(ctrl1, ctrl2, undefined, undefined);
	const { words } = props;
	// const location = useLocation();
	// const navigate = useNavigate();

	// const results = { winner: 'John', loser: 'Doe', score: '3-1', matchType: 'demi1' };
	// navigate('/tournament', { state: { results } });

	return (
		<div className="pong">
			<Scores avatar={Avatar1Src} name={"ttaquet"} result={6} ctrl={ctrl1} is2vs2={false} words={words} />
			<Arena pad1Pos={pad1Pos} pad2Pos={pad2Pos} ballPos={ballPos} />
			<Scores avatar={Avatar2Src} name={"tmp_usrname"} result={4} ctrl={ctrl2} is2vs2={false} words={words} />
		</div>
	);
}
