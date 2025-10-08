import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import Profile from "./Profile";
import Stats from "./Stats";
import AddFriend from "./AddFriend";
import useBoard from "../../../hooks/useBoard";
import UsernameInput from "../../game/UsernameInput";
import type { BodyGamesProps } from "../../../interfaces/BodyGames";
import "../../../styles/board/body-games/BodyGames.css";

export default function BodyGames(props: BodyGamesProps) {
	const [ modeToLaunch, setModeToLaunch ] = useState<string | null>(null);
	const [ usernames, setUsernames ] = useState<string[]>(Array(3).fill(''));
	const { openElement } = useBoard();
	const navigate = useNavigate();
	const { words } = props;

	const handleGameSelect = (mode: string) => {
		if (mode === 'tournament') {
			navigate('/tournament');
		} else if (mode === '1vsIA') {
			navigate('/game/1vsia');
		} else if (mode === '1vs1') {
			setModeToLaunch(mode);
		} else if (mode === '2vs2') {
			setModeToLaunch(mode);
		} else if (mode == 'billiard') {
			navigate('/billiard_game/');
		}
    };

	// DRY !!!
	function handleInputChange(e: ChangeEvent<HTMLInputElement>, index: number): void {
		const { value } = e.target;
		setUsernames(prevNames => {
			const newNames = [... prevNames];
			newNames[index] = value;
			return newNames;
		});
	}

	const handleFormSubmit = (usernames: string[]) => {
        navigate(`/game/${modeToLaunch}`, { state: { usernames } });
    };

	return (
		<main className="body-games">
			{
				openElement === "profile" || openElement === "stats" || openElement === "addfriend" ?
				(
					<Modal>
						<Profile words={words} />
						<Stats words={words} />
						<AddFriend words={words} />
					</Modal>
				) :
				(
					modeToLaunch &&
					<UsernameInput mode={modeToLaunch} users={usernames} onChange={handleInputChange} onSubmit={handleFormSubmit} words={words} />
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
			<button className="body-games-btn billiard" onClick={() => handleGameSelect('billiard')}>
				{words.messages.board["billiard"]}
			</button>
		</main>
	);
}