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
	const { user } = useAuth();
	const location = useLocation();
	let userLogin;
	user ? userLogin = {name: user.name, avatar: user.avatar.slice(8)} : null;
	const { gameState, sendInput } = usePongGame('versusIa', userLogin, location.state);
	const { words } = props;
	useGameControls(sendInput);

    if (!gameState) {
        return <p>Connexion au serveur de jeu...</p>;
    }

	return (
		<div className="pong">
            <Scores
                avatar={userLogin?.avatar ? userLogin.avatar : user.avatar}
                name={userLogin?.name ? userLogin.name : user.name}
                result={gameState.score.p1}
                ctrl={ctrl1}
                isAI={false}
                words={words}
            />
            <Arena
                pad1Pos={gameState.pads[1]}
                pad2Pos={gameState.pads[2]}
                ballPos={gameState.ball}
            />
            <Scores
                avatar={"/avatars/defaults/DecoyJerry.png"}
                name={words.messages.AIOpponent}
                result={gameState.score.p2}
                ctrl={ctrl1}
                isAI={true}
                words={words}
            />
        </div>
	);
}
