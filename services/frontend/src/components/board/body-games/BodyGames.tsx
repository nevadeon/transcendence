import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import Profile from "./Profile";
import Stats from "./Stats";
import useBoard from "../../../hooks/useBoard";
import UsernameInput from "../../game/UsernameInput";
import type { BodyGamesProps } from "../../../interfaces/BodyGames";
import PortraitSrc from "../../../assets/avatars/big-rick.png";
import "../../../styles/board/body-games/BodyGames.css";

export default function BodyGames(props: BodyGamesProps) {
	const [ modeToLaunch, setModeToLaunch ] = useState<string | null>(null);
	const [ numUser, setNumUser ] = useState<number>(1);
	const { openElement } = useBoard();
	const navigate = useNavigate();
	const { words } = props;

	// ESC key on Board.tsx to close UsernameInput.tsx
	// || click on another mode to reopen right one
	// + useUser() hook to get current login username for ALL
	const handleGameSelect = (mode: string) => {
		if (mode === 'tournament') {
			setNumUser(3);
			navigate('/tournament');
		} else if (mode === '1vsIA') {
			navigate('/game/1vsia');
		} else if (mode === '1vs1') {
			setNumUser(1);
			setModeToLaunch(mode);
		} else if (mode === '2vs2') {
			setNumUser(3);
			setModeToLaunch(mode);
		}
    };

	const handleFormSubmit = (usernames: string[]) => {
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
					modeToLaunch &&
					<UsernameInput mode={modeToLaunch} numUser={numUser} onSubmit={handleFormSubmit} words={words} />
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