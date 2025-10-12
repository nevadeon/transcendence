import Scores from "./Scores";
import Arena from "./Arena";
import { useLocation } from "react-router";
import usePongGame from "../../hooks/usePongGame";
import { useGameControls } from "../../hooks/useGameControls";
import { useAuth } from "../../contexts/auth/useAuth";
import type { Pong1vsIAProps } from "../../interfaces/Pong1vsIA";

// /game/1vsia
// TODO: import Arena and Scores Component + canvas setup
export default function Pong1vsIA(props: Pong1vsIAProps) {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'p', downKey: 'l' };
	const { user } = useAuth();
	const location = useLocation();
	let userLogin;
	user ? userLogin = {name: user.name, avatar: user.avatar.slice(9)} : null;
	const { gameState, sendInput } = usePongGame('versusIa', userLogin, location.state);
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
