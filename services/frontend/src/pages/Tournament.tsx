import { useState, type ChangeEvent } from "react";
// import { useNavigate } from "react-router";
import Tournament from "../components/game/Tournament.tsx";
import UsernameInput from "../components/game/UsernameInput.tsx";
import { useAuth } from "../contexts/auth/useAuth.tsx";
import useLanguage from "../hooks/useLanguage";
import TeleportSrc from "../assets/tournament/teleport-bg.png";
import "../styles/tournament/Tournament.css";

const BASE_URL = import.meta.env.API_ADDR;
const USER_STATS_PORT = import.meta.env.USER_STATS_PORT;
const NUM_USERS = 4;

export default function TournamentPage() {
	const [ usernames, setUsernames ] = useState<string[]>(Array(NUM_USERS).fill(''));
	const words = useLanguage();
	const { user, token } = useAuth();
	const 
	// const navigate = useNavigate();

	function handleInputChange(e: ChangeEvent<HTMLInputElement>, index: number): void {
		const { value } = e.target;
		setUsernames(prevNames => {
			const newNames = [... prevNames];
			newNames[index] = value;
			return newNames;
		});
	}

	async function handleFormSubmit(trimmedUsernames, avatars) {
		//...
	};
	
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

	return (
		<div className="tournament-page" style={backgroundStyle}>
			<UsernameInput mode={"tournament"} users={usernames} onChange={handleInputChange} onSubmit={handleFormSubmit} words={words} />
			<Tournament users={usernames} words={words} />
			<div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: '#214241', opacity: '50%'}}></div>
		</div>
	);
}