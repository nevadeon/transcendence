import Scores from "./Scores";
import Arena from "./Arena";
import { useLocation } from "react-router";
import usePongGame from "../../hooks/usePongGame";
import { useGameControls } from "../../hooks/useGameControls";
import { useAuth } from "../../contexts/auth/useAuth";
import useTournament from "../../contexts/tournament/useTournament";
import type { Pong1vsIAProps } from "../../interfaces/Pong1vsIA";
import { useEffect } from "react";

// /game/1vsia
// TODO: import Arena and Scores Component + canvas setup
export default function Pong1vsIA(props: Pong1vsIAProps) {
	const ctrl1 = { upKey: 'q', downKey: 's' };
	const { user } = useAuth();
	const location = useLocation();
	const { tournament, closeTournament } = useTournament();
	
	let userLogin;
	user ? userLogin = {name: user.name, avatar: user.avatar} : null;
	
	// Nettoyer le contexte tournament seulement si on a vraiment un tournoi actif
	// mais qu'on n'est pas censé être dans un match de tournoi
	useEffect(() => {
		// Ne nettoyer que si on est en mode 1vsIA et qu'un tournoi existe
		// (cela signifie qu'on vient d'un tournoi mais on joue maintenant contre l'IA)
		if (tournament) {
			console.log("Nettoyage du contexte tournament dans 1vsIA");
			closeTournament();
		}
	}, [tournament, closeTournament]);
	
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
