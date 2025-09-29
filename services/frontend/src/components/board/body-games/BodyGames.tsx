import { useState } from "react";
import Modal from "./Modal";
import Profile from "./Profile";
import Stats from "./Stats";
import type { BodyGamesProps } from "../../../interfaces/BodyGames";
import PortraitSrc from "../../../assets/avatars/big-rick.png";
import "../../../styles/board/body-games/BodyGames.css";

export default function BodyGames(props: BodyGamesProps) {
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [isProfile, setIsProfile] = useState<boolean>(false);
	// const [isStats, setIsStats] = useState<boolean>(false);
	const { words } = props;

	function handleCloseModal() {
		setIsOpen(false);
	}

	return (
		<main className="body-games">
			{ isOpen && (
				<Modal onClose={handleCloseModal}>
					{
						isProfile ?
						<Profile avatar={PortraitSrc} words={words} /> :
						<Stats words={words} />
					}
				</Modal>
			)}
			<button className="body-games-btn 1vs1">
				{words.messages.board["1vs1"]}
			</button>
			<button className="body-games-btn 2vs2">
				{words.messages.board["2vs2"]}
			</button>
			<button className="body-games-btn 1vs1">
				{words.messages.board["1vsia"]}
			</button>
			<button className="body-games-btn 1vs1">
				{words.messages.board.tournament}
			</button>
		</main>
	);
}