import { useParams } from "react-router";
import Pong1vs1 from "../components/game/Pong1vs1";
import Pong2vs2 from "../components/game/Pong2vs2";
import Pong1vsIA from "../components/game/Pong1vsIA";
import Tournament from "../components/game/Tournament";
import GameBackground from "../components/game/GameBackground";
import "../styles/game/Game.css";

const backgrounds = [
	() => import("../assets/game/backgrounds/planet1_bg.png"),
	() => import("../assets/game/backgrounds/planet2_bg.png"),
	() => import("../assets/game/backgrounds/planet3_bg.png"),
	() => import("../assets/game/backgrounds/planet4_bg.png"),
	() => import("../assets/game/backgrounds/planet5_bg.png"),
	() => import("../assets/game/backgrounds/planet6_bg.png"),
	() => import("../assets/game/backgrounds/planet7_bg.png"),
	() => import("../assets/game/backgrounds/planet8_bg.png"),
	() => import("../assets/game/backgrounds/planet9_bg.png"),
	() => import("../assets/game/backgrounds/planet10_bg.png"),
];

// /game
export default function GamePage() {
	const { mode } = useParams<{mode: string}>();
	const bgPath = mode === '2vs2' ? null : randomBackground();

	function randomBackground() {
		const randomIndex = Math.floor(Math.random() * backgrounds.length);
  		return backgrounds[randomIndex];
	}

	function renderMode() {
		switch(mode) {
			case '1vs1':
				return <Pong1vs1 />;
			case '2vs2':
				return <Pong2vs2 />;
			case '1vsia':
				return <Pong1vsIA />;
			default:
				return <Tournament />;
		}
	}

	return (
		<>
			{bgPath ? (
				<GameBackground imgUrl={bgPath}>
					{renderMode()}
				</GameBackground>
      		) : (
				<div className="game-page" style={{ background: 'url(planet8_bg.png)' }}>
					{renderMode()}
				</div>
	  		)}
		</>
	);
}
