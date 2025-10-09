// import { useLocation, useNavigate } from "react-router";
import Scores from "./Scores";
import Arena from "./Arena";
import { useLocation } from "react-router";
import usePongGame from "../../hooks/usePongGame";
import { useGameControls } from "../../hooks/useGameControls";
import { useAuth } from "../../contexts/auth/useAuth";
import type { Pong1vs1Props } from "../../interfaces/Pong1vs1";

// /game/1vs1
export default function Pong1vs1(props: Pong1vs1Props) {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'o', downKey: 'l' };
	const { user } = useAuth();
	const location = useLocation();
	let userLogin;
	user ? userLogin = {name: user.name, avatar: user.avatar.slice(9)} : null;
	const { gameState, sendInput } = usePongGame('versus', userLogin, location.state);

	// pads[1], pads[3] for left side , then pads[2], pads[4] BUT pads[2] doesn't respond !!!
	// const navigate = useNavigate(); //tournament matchmaking flow
	const { words } = props;

	useGameControls(sendInput);

	if (!gameState) {
        return <p>Connexion au serveur de jeu...</p>;
    }

	return (
		<div className="pong">
			<Scores
				avatar={user.avatar ? user.avatar.slice(9) : location.state.avatars[0]}
				name={user.name ? user.name : location.state.usernames[0]}
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
				avatar={user.avatar ? location.state.avatars[0] : location.state.avatars[1]}
				name={user.name ? location.state.usernames[0] : location.state.usernames[1]}
				result={gameState.score.p2}
				ctrl={ctrl2}
				is2vs2={false}
				words={words}
			/>
		</div>
	);
}
