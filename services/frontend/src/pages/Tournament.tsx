import { useNavigate } from "react-router";
import Tournament from "../components/game/Tournament.tsx";
import UsernameInput from "../components/game/UsernameInput.tsx";
import useLanguage from "../hooks/useLanguage";
import TeleportSrc from "../assets/tournament/teleport-bg.png";
import "../styles/tournament/Tournament.css";

export default function TournamentPage() {
	const words = useLanguage();
	const navigate = useNavigate();

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

	const handleFormSubmit = (usernames: string[]) => {
        navigate(`/game/1vs1`, { state: { usernames } });
    };

	return (
		<div className="tournament-page" style={backgroundStyle}>
			<UsernameInput mode={"tournament"} numUser={3} onSubmit={handleFormSubmit} words={words} />
			<Tournament words={words} />
			<div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: '#214241', opacity: '50%'}}></div>
		</div>
	);
}