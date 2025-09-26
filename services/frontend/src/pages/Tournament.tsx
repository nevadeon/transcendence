import { useState, type ChangeEvent } from "react";
import Tournament from "../components/game/Tournament.tsx";
import type { FormData } from "../interfaces/Form.ts";
import TeleportSrc from "../assets/tournament/teleport-bg.png";
import "../styles/tournament/Tournament.css";

export default function TournamentPage() {
	const [userData, setUserData] = useState<FormData>({ name: '', email: '', password: '' });

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setUserData(( prev: FormData ) => ( { ...prev, [name]: value } ));
	}

	return (
		<div className="tournament-page" style={{ background: `url(${TeleportSrc})` }}>
			<div className="usrname-input tournament-input">
				<input
					type="text"
					id="name"
					name="name"
					onChange={handleInputChange}
					value={userData.name}
					required
					autoComplete='off'
					pattern="^[a-zA-Z0-9]{3,24}$"
					title="Username must be 3-24 characters long and contain only letters and numbers."
				/>
			</div>
			<Tournament />
		</div>
	);
}