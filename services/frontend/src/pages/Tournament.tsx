import { useState, type ChangeEvent } from "react";
// import { useNavigate } from "react-router";
// import { useAuth } from "../contexts/auth/useAuth.tsx";
import Tournament from "../components/game/Tournament.tsx";
import UsernameInput from "../components/game/UsernameInput.tsx";
import useLanguage from "../hooks/useLanguage";
import TeleportSrc from "../assets/tournament/teleport-bg.png";
import "../styles/tournament/Tournament.css";
import HomeButton from "../components/game/HomeButton.tsx";

const BASE_URL = import.meta.env.API_ADDR;
const USER_STATS_PORT = import.meta.env.USER_STATS_PORT;
const NUM_USERS = 4;

export default function TournamentPage() {
	const [ usernames, setUsernames ] = useState<string[]>(Array(NUM_USERS).fill(''));
	const words = useLanguage();
	// const { token } = useAuth();
	// const navigate = useNavigate();

	function handleInputChange(e: ChangeEvent<HTMLInputElement>, index: number): void {
		const { value } = e.target;
		setUsernames(prevNames => {
			const newNames = [... prevNames];
			newNames[index] = value;
			return newNames;
		});
	}

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

	async function handleFormSubmit(usernames: string[]) {
		try {
			const res = await fetch(`${BASE_URL}${USER_STATS_PORT}/record_match`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( {
					red_team_A: 'username1',
					red_team_B: usernames[0],
					blue_team_A: usernames[1],
					blue_team_B: usernames[2],
					mode: 'versus',
					red_team_score: 7,
					blue_team_score: 4,
					winner: 'red'
				} )
			});
			console.log("test");
			const data = await res.json();
			console.log("test");
			if (res.ok) {
				console.log('Registration successful', data);
			} else {
				console.error('Registration failed');
			}
		} catch(err) {
			console.error('Registration error: ', err)
		}
		//timeout(5000) + {state: {users: usernames, demis: ... }}
		// navigate('/game/1vs1', { state: usernames });
    };

	return (
		<div className="tournament-page" style={backgroundStyle}>
			<HomeButton/>
			<UsernameInput mode={"tournament"} users={usernames} onChange={handleInputChange} onSubmit={handleFormSubmit} words={words} />
			<Tournament users={usernames} words={words} winnerA="" winnerB=""/>
			<div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: '#214241', opacity: '50%'}}></div>
		</div>
	);
}