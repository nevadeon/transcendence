import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import Profile from "./Profile";
// import Stats from "./Stats";
import AddFriend from "./AddFriend";
import useBoard from "../../../hooks/useBoard";
import UsernameInput from "../../game/UsernameInput";
import useTournament from "../../../contexts/tournament/useTournament";
import type { BodyGamesProps } from "../../../interfaces/BodyGames";
import "../../../styles/board/body-games/BodyGames.css";
import type { MatchUsersTemp } from "../../../interfaces/Tournament";

export default function BodyGames(props: BodyGamesProps) {
	const [ modeToLaunch, setModeToLaunch ] = useState<string | null>(null);
	const [ usernames, setUsernames ] = useState<string[]>(Array(3).fill(''));
	const { openElement } = useBoard();
	const { closeTournament } = useTournament();
	const navigate = useNavigate();
	const { words } = props;

	const handleGameSelect = (mode: string) => {
		if (mode === 'tournament') {
			navigate('/tournament');
		} else {
			// Fermer le tournoi existant si on sélectionne un autre mode
			closeTournament();
			
			if (mode === '1vsIA') {
				navigate('/game/1vsia');
			} else if (mode === '1vs1') {
				setUsernames(Array(1).fill(''));
				setModeToLaunch(mode);
			} else if (mode == 'billiard') {
				navigate('/game/billiard');
			} else if (mode == '2vs2') {
				navigate('/game/2vs2');
			}
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

	const handleFormSubmit = (challengers: MatchUsersTemp[]) => {
        navigate(`/game/${modeToLaunch}`, { state: challengers }); //+random avatars here??? avatars: string[]
    };

	return (
		<main className="body-games">
			{
				openElement === "profile" || openElement === "stats" || openElement === "addfriend" ?
				(
					<Modal>
						<Profile words={words} />
						{/* <Stats words={words} /> */}
						<AddFriend words={words} />
					</Modal>
				) : (
					modeToLaunch &&
						<UsernameInput
						mode={modeToLaunch}
						users={usernames}
						onChange={handleInputChange}
						onSubmit={handleFormSubmit}
						words={words} />
				)
			}
			{
			 <div className={
				"body-games-btn-group" + 
				(openElement === "profile" || openElement === "stats" || openElement === "addfriend" ? " hidden" : "")}>
				<button className="body-games-btn" onClick={() => handleGameSelect('1vs1')}>
					<span>{words.messages.board["1vs1"]}</span>
				</button>
				<button className="body-games-btn" onClick={() => handleGameSelect('2vs2')}>
					<span>{words.messages.board["2vs2"]}</span>
				</button>
				<button className="body-games-btn" onClick={() => handleGameSelect('1vsIA')}>
					<span>{words.messages.board["1vsia"]}</span>
				</button>
				<button className="body-games-btn" onClick={() => handleGameSelect('tournament')}>
					<span>{words.messages.board.tournament}</span>
				</button>
				<button className="body-games-btn" onClick={() => handleGameSelect('billiard')}>
					<span>{words.messages.board["billiard"]}</span>
				</button>
			</div> 
			}
		</main>
	);
}