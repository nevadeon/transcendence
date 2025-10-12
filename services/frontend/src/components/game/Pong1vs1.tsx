import { useNavigate, useLocation } from "react-router";
import usePongGame from "../../hooks/usePongGame";
import { useAuth } from "../../contexts/auth/useAuth";
import { useGameControls } from "../../hooks/useGameControls";
import useTournament from "../../contexts/tournament/useTournament";
import type { Pong1vs1Props } from "../../interfaces/Pong1vs1";
import Scores from "./Scores";
import Arena from "./Arena";
import { useSearchParams } from "react-router";

// /game/1vs1
export default function Pong1vs1(props: Pong1vs1Props) {
	const ctrl1 = { upKey: 'q', downKey: 's' };
	const ctrl2 = { upKey: 'o', downKey: 'l' };
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { tournament } = useTournament();
	const [ SearchParams, setSearchParams ] = useSearchParams();
	setSearchParams;
	const activePhase = SearchParams.get('phase');

	let mode;
	tournament?.isTournament ? mode = "tournament" : mode = "versus";
	let userLogin;
	if (!tournament && location.state.from === '/tournament') //F5, tournament context logic lost but could be in 1vs1 !
			navigate('/board', { replace: true });
	const { gameState, sendInput } = usePongGame(mode, userLogin, location.state);
	const { words } = props;
	useGameControls(sendInput);
	if (!gameState) {
		return <p>Connexion au serveur de jeu...</p>;
	}
	if (!tournament) {
		user ? userLogin = {name: user.name, avatar: user.avatar.slice(9)} : null;


		console.log("location.state: ", location.state);

		return (
			<div className="pong">
				<Scores
					avatar={user.avatar ? user.avatar.slice(9) : location.state.avatars[0]}
					name={null}
					result={gameState?.score.p1}
					ctrl={ctrl1}
					isAI={false}
					words={words}
				/>
				<Arena
					pad1Pos={gameState?.pads[1]}
					pad2Pos={gameState?.pads[2]}
					ballPos={gameState?.ball}
				/>
				<Scores
					avatar={"/avatars/defaults/morty.png"}
					name={location.state[0] || "bot" }
					result={gameState?.score.p2}
					ctrl={ctrl2}
					isAI={false}
					words={words}
				/>
			</div>
		);
	}
	else {
		const matches = tournament.results?.matches;

		let opponantA;
		let opponantB;
		let avatarA;
		let avatarB;
		if (activePhase === 'demi1') {
			opponantA = matches?.[0]?.opponents?.[0]?.name;
			opponantB = matches?.[0]?.opponents?.[1]?.name;
			avatarA = matches?.[0]?.opponents?.[0]?.avatar;
			avatarA = matches?.[0]?.opponents?.[1]?.avatar;
		} else if (activePhase === 'demi2') {
			opponantA = matches?.[1]?.opponents?.[0]?.name;
			opponantB = matches?.[1]?.opponents?.[1]?.name;
			avatarA = matches?.[1]?.opponents?.[0]?.avatar;
			avatarA = matches?.[1]?.opponents?.[1]?.avatar;
		} else if (activePhase === 'final') {
			opponantA = matches?.[2]?.opponents?.[0]?.name;
			opponantB = matches?.[2]?.opponents?.[1]?.name;
			avatarA = matches?.[2]?.opponents?.[0]?.avatar;
			avatarA = matches?.[2]?.opponents?.[1]?.avatar;
		}
		return (
			<div className="pong">
				<Scores
					avatar={avatarA ? avatarA : "/avatars/defaults/morty.png"}
					name={opponantA ? opponantA : "Jordans"}
					result={gameState?.score.p1}
					ctrl={ctrl1}
					isAI={false}
					words={words}
				/>
				<Arena
					pad1Pos={gameState?.pads[1]}
					pad2Pos={gameState?.pads[2]}
					ballPos={gameState?.ball}
				/>
				<Scores
					avatar={avatarB ? avatarB : "/avatars/defaults/morty.png"}
					name={opponantB ? opponantB : "Jordans"}
					result={gameState?.score.p2}
					ctrl={ctrl2}
					isAI={false}
					words={words}
				/>
			</div>
		);
	}
}
