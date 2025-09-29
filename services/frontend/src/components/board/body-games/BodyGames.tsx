import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import Profile from "./Profile";
import Stats from "./Stats";
import PortraitSrc from "../../../assets/avatars/big-rick.png";
import "../../../styles/board/body-games/BodyGames.css";
import useBoard from "../../../hooks/useBoard";
import UsernameInput from "../../game/UsernameInput";

export default function BodyGames() {
	const [modeToLaunch, setModeToLaunch] = useState<string | null>(null);
	const { openElement, toggleElement } = useBoard();
	const navigate = useNavigate();

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
						<Profile avatar={PortraitSrc} />
						<Stats />
					</Modal>
				) :
				(
					modeToLaunch && <UsernameInput mode={modeToLaunch} onSubmit={handleFormSubmit} />
				)
				
			}
			<button className="body-games-btn 1vs1" onClick={() => handleGameSelect('1vs1')}>
				DIMENSION DUEL
			</button>
			<button className="body-games-btn 2vs2" onClick={() => handleGameSelect('2vs2')}>
				CITADEL CLASH
			</button>
			<button className="body-games-btn 1vs1" onClick={() => handleGameSelect('1vsIA')}>
				VS MR.MEESEEKS
			</button>
			<button className="body-games-btn 1vs1" onClick={() => handleGameSelect('tournament')}>
				PICKLE RICK CUP
			</button>
		</main>
	);
}