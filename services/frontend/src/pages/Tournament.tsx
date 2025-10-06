import { useState, type ChangeEvent } from "react";
// import { useNavigate } from "react-router";
import Tournament from "../components/game/Tournament.tsx";
import UsernameInput from "../components/game/UsernameInput.tsx";
import useLanguage from "../hooks/useLanguage";
import TeleportSrc from "../assets/tournament/teleport-bg.png";
import "../styles/tournament/Tournament.css";

// const BASE_URL = process.env.;

export default function TournamentPage() {
	const [ usernames, setUsernames ] = useState<string[]>(Array(3).fill(''));
	const words = useLanguage();
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
			const res = await fetch("http://localhost:3003/record_match", {
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
			const data = await res.json();
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
			<UsernameInput mode={"tournament"} users={usernames} onChange={handleInputChange} onSubmit={handleFormSubmit} words={words} />
			<Tournament users={usernames} words={words} />
			<div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: '#214241', opacity: '50%'}}></div>
		</div>
	);
}