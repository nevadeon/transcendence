import { Profiler } from "react";
import { useParams } from "react-router";
import Pong1vs1 from "../components/game/Pong1vs1";
import Pong1vsIA from "../components/game/Pong1vsIA";
import GameBackground from "../components/game/GameBackground";
import useLanguage from "../hooks/useLanguage";
import CitadelClashSrc from "../assets/game/backgrounds/planet8_bg.png";
import "../styles/game/Game.css";
import HomeButton from "../components/game/HomeButton";

const backgrounds = [
	() => import("../assets/game/backgrounds/planet1_bg.png"),
	() => import("../assets/game/backgrounds/planet2_bg.png"),
	() => import("../assets/game/backgrounds/planet3_bg.png"),
	() => import("../assets/game/backgrounds/planet4_bg.png"),
	() => import("../assets/game/backgrounds/planet5_bg.png"),
	() => import("../assets/game/backgrounds/planet6_bg.png"),
	() => import("../assets/game/backgrounds/planet7_bg.png"),
	() => import("../assets/game/backgrounds/planet9_bg.png"),
	() => import("../assets/game/backgrounds/planet10_bg.png"),
];

// /game
export default function GamePage() {
	const { mode } = useParams<{mode: string}>();
	const words = useLanguage();
	const bgPath = randomBackground();

	function randomBackground() {
		const randomIndex = Math.floor(Math.random() * backgrounds.length);
  		return backgrounds[randomIndex];
	}

	function onRender(id: any, phase: any, actualDuration: any, baseDuration: any, startTime: any, commitTime: any) {
		console.log({
			id,
			phase,
			actualDuration: actualDuration + 'ms',
			baseDuration: baseDuration + 'ms',
			startTime: startTime.toFixed(2) + 'ms',
			commitTime: commitTime.toFixed(2) + 'ms'
		});
	}

	function renderMode() {
		switch(mode) {
			case '1vs1':
				return <Profiler id="Pong1vs1" onRender={onRender}> <Pong1vs1 words={words} /> </Profiler>;
			case '1vsia':
				return <Profiler id="Pong1vsIA" onRender={onRender}> <Pong1vsIA words={words} /> </Profiler>;
			default:
				return ; //<Tournament words={words} /> ???
		}
	}

	return (
		<>
			{bgPath ? (
				<GameBackground imgUrl={bgPath}>
					<HomeButton/>
					{renderMode()}
				</GameBackground>
      		) : (
				<div className="game-page" style={{ background: `url(${CitadelClashSrc})` }}>
					<HomeButton/>
					{renderMode()}
				</div>
	  		)}
		</>
	);
}
