import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import Profile from "./Profile";
import Stats from "./Stats";
import type { BodyGamesProps } from "../../../interfaces/BodyGames";
import PortraitSrc from "../../../assets/avatars/big-rick.png";
import "../../../styles/board/body-games/BodyGames.css";
import useBoard from "../../../hooks/useBoard";
import UsernameInput from "../../game/UsernameInput";

export default function BodyGames(props: BodyGamesProps) {
	const [modeToLaunch, setModeToLaunch] = useState<string | null>(null);
	const { openElement, toggleElement } = useBoard();
	const navigate = useNavigate();
	const { words } = props;

	const handleGameSelect = (mode: string) => {
		if (mode === 'tournament') {
			navigate('/tournament'); 
		} else if (mode === 'stats') {
			setModeToLaunch(mode);
			toggleElement('stats');
		} else if (mode === 'profile') {
			setModeToLaunch(mode);
			toggleElement('stats');
		}
    };

	const handleFormSubmit = (usernames: string[]) => {
        toggleElement(null);
        navigate(`/game/${modeToLaunch}`, { state: { usernames } });
    };

	return (
		<main className="body-games">
			{
				openElement === "profile" || openElement === "stats" ?
				(
					<Modal>
						<Profile avatar={PortraitSrc} words={words} />
						<Stats words={words} />
					</Modal>
				) :
				(
					modeToLaunch && <UsernameInput mode={modeToLaunch} onSubmit={handleFormSubmit} words={words} />
				)
				
			}
			<button className="body-games-btn 1vs1" onClick={() => handleGameSelect('1vs1')}>
				{words.messages.board["1vs1"]}
			</button>
			<button className="body-games-btn 2vs2" onClick={() => handleGameSelect('2vs2')}>
				{words.messages.board["2vs2"]}
			</button>
			<button className="body-games-btn 1vs1" onClick={() => handleGameSelect('1vsIA')}>
				{words.messages.board["1vsia"]}
			</button>
			<button className="body-games-btn 1vs1" onClick={() => handleGameSelect('tournament')}>
				{words.messages.board.tournament}
			</button>
		</main>
	);
}