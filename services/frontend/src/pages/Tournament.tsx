import { useState, type ChangeEvent } from "react";
import Tournament from "../components/game/Tournament.tsx";
import UsernameInput from "../components/game/UsernameInput.tsx";
import type { FormData } from "../interfaces/Form.ts";
import TeleportSrc from "../assets/tournament/teleport-bg.png";
import "../styles/tournament/Tournament.css";

export default function TournamentPage() {
	const [userData, setUserData] = useState<FormData>({ name: '', email: '', password: '' });
	const backgroundStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100vw',
		height: '100vh',
		backgroundImage: `url(${TeleportSrc})`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
	};

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setUserData(( prev: FormData ) => ( { ...prev, [name]: value } ));
	}

	return (
		<div className="tournament-page" style={backgroundStyle}>
			<UsernameInput data={userData} onChange={handleInputChange} />
			<Tournament />
			<div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: '#214241', opacity: '50%'}}></div>
		</div>
	);
}