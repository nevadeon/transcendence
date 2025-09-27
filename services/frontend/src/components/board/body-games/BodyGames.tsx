// import { useState } from "react";
// import Modal from "./Modal";
// import Profile from "./Profile";
// import Stats from "./Stats";
// import PortraitSrc from "../../../assets/avatars/big-rick.png";
import "../../../styles/board/body-games/BodyGames.css";

export default function BodyGames() {
	// const [isOpen, setIsOpen] = useState<boolean>(true);
	// const [isProfile, setIsProfile] = useState<boolean>(false);
	// const [isStats, setIsStats] = useState<boolean>(false);

	// function handleCloseModal() {
	// 	setIsOpen(false);
	// }

	return (
		<main className="body-games">
			{/* { isOpen && (
				<Modal onClose={handleCloseModal}>
					{
						isProfile ?
						<Profile portraitSrc={PortraitSrc} /> :
						<Stats />
					}
				</Modal>
			)} */}
			<button className="body-games-btn 1vs1">
				DIMENSION DUEL
			</button>
			<button className="body-games-btn 2vs2">
				CITADEL CLASH
			</button>
			<button className="body-games-btn 1vs1">
				VS MR.MEESEEKS
			</button>
			<button className="body-games-btn 1vs1">
				PICKLE RICK CUP
			</button>
		</main>
	);
}