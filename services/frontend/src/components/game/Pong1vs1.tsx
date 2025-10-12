import { useNavigate, useLocation } from "react-router";
import usePongGame from "../../hooks/usePongGame";
import { useAuth } from "../../contexts/auth/useAuth";
import { useGameControls } from "../../hooks/useGameControls";
import useTournament from "../../contexts/tournament/useTournament";
import type { Pong1vs1Props } from "../../interfaces/Pong1vs1";


// /game/1vs1
export default function Pong1vs1(props: Pong1vs1Props) {
	// const ctrl1 = { upKey: 'q', downKey: 'a' };
	// const ctrl2 = { upKey: 'o', downKey: 'l' };
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { tournament } = useTournament();
	let mode;
	tournament?.isTournament ? mode = "tournament" : mode = "versus";
	let userLogin;
	user ? userLogin = {name: user.name, avatar: user.avatar.slice(9)} : null;
	const { gameState, sendInput } = usePongGame(mode, userLogin, location.state);

	const { words } = props;
	words

	useGameControls(sendInput);

	if (!gameState) {
        return <p>Connexion au serveur de jeu...</p>;
    }

	console.log("location.state: ", location.state);

	if (!tournament && location.state.from === '/tournament') //F5, tournament context logic lost but could be in 1vs1 !
		navigate('/board', { replace: true });

	return (
		<div className="pong">
			{/* <Scores
				avatar={user.avatar ? user.avatar.slice(9) : location.state.avatars[0]}
				name={null}
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
				avatar={"/avatars/defaults/morty.png"}
				name={usernames[0] || "bot" }
				result={gameState.score.p2}
				ctrl={ctrl2}
				isAI={false}
				words={words}
			/> */}
		</div>
	);
}
