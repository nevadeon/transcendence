import { useParams } from "react-router";
import Pong1vs1 from "../components/game/Pong1vs1";
import Pong2vs2 from "../components/game/Pong2vs2";
import Pong1vsIA from "../components/game/Pong1vsIA";
import Tournament from "../components/game/Tournament";
import "../styles/game/Game.css";

// /game
export default function GamePage() {
	const { mode } = useParams<{mode: string}>();

	function renderMode() {
		switch(mode) {
			case '1vs1':
				return <Pong1vs1 />;
			case '2v2':
				return <Pong2vs2 />;
			case '1vAI':
				return <Pong1vsIA />;
			default:
				return <Tournament />;
		}
	}

	return (
		<div className="game-page">
			{renderMode()}
		</div>
	);
}