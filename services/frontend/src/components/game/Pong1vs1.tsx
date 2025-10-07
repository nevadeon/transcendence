// import { useLocation, useNavigate } from "react-router";
import Scores from "./Scores";
import Arena from "./Arena";
import usePongGame from "../../hooks/usePongGame";
import { useGameControls } from "../../hooks/useGameControls";
import { useAuth } from "../../contexts/auth/useAuth";
import Avatar2Src from "../../../public/avatars/defaults/spaceMorty.png";
import type { Pong1vs1Props } from "../../interfaces/Pong1vs1";

// /game/1vs1
export default function Pong1vs1(props: Pong1vs1Props) {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'o', downKey: 'l' };
	const { user } = useAuth();
	const { gameState, sendInput } = usePongGame('versus', user.id);
	// pads[1], pads[3] for left side , then pads[2], pads[4]
	// const { tmp_user } = useTemp(); //from inputs in /board = useContext? or in db before 30min erase?
	// const location = useLocation(); //tournament matchmaking flow
	// const navigate = useNavigate(); //tournament matchmaking flow
	const { words } = props;

	useGameControls(sendInput);

	if (!gameState) {
        return <p>Connexion au serveur de jeu...</p>;
    }

	return (
		<div className="pong">
			<Scores
				avatar={user.avatar}
				name={user.name}
				result={gameState.score.p1}
				ctrl={ctrl1}
				is2vs2={false}
				words={words}
			/>
			<Arena
				pad1Pos={gameState.pads[1]}
				pad2Pos={gameState.pads[2]}
				ballPos={gameState.ball}
			/>
			<Scores
				avatar={Avatar2Src}
				name={"tmp_usrname"}
				result={gameState.score.p2}
				ctrl={ctrl2}
				is2vs2={false}
				words={words}
			/>
		</div>
	);
}
