import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import Tournament from "../components/game/Tournament.tsx";
import UsernameInput from "../components/game/UsernameInput.tsx";
import useLanguage from "../hooks/useLanguage";
import { useAuth } from "../contexts/auth/useAuth.tsx";
import useTournament from "../contexts/tournament/useTournament.tsx";
import type { MatchUsersTemp } from "../interfaces/Tournament.ts";
import TeleportSrc from "../assets/tournament/teleport-bg.png";
import "../styles/tournament/Tournament.css";
import { handleRandomAvatars } from "../utils/handleRandAvatars.ts";

const NUM_USERS = 3;
const DELAY_MS = 5000;

export default function TournamentPage() {
	const [ usernames, setUsernames ] = useState<string[]>(Array(NUM_USERS).fill(''));
	const { tournament, initTournament, updateMatches, closeTournament } = useTournament();
	const { user } = useAuth();
	const words = useLanguage();
	const navigate = useNavigate();

	const finalMatch = tournament?.results?.matches?.find(m => m.phase === 'final');
    const isTournamentOver = finalMatch?.winnerId !== null;
	const userAvatar = user?.avatar;

	const getNextPhase = () => {
		if (!tournament)
			return undefined;
		const matches = tournament.results?.matches;
		const nextMatch = matches?.find(match => match.winnerId === undefined);
		console.log("nextMatch: ", nextMatch);
		if (nextMatch) {
			console.log("nextMatch: ", nextMatch)
			return nextMatch.phase; // "demi1", "demi2", ou "final"
		}
		return undefined; // Le tournoi est terminé
	};
	const nextPhase = getNextPhase();

	useEffect(() => {
		if (!tournament) {
			let avatars;
			user ? avatars = handleRandomAvatars(userAvatar, 3, user) : avatars = handleRandomAvatars(undefined, 4, null);
			if (user) {
				console.log("initTournament with login user\n");
				initTournament(user, avatars);
			}
			else {
				console.log("initTournament without login user\n");
				initTournament(null, avatars);
			}
		}

		let timer = null;
		if (tournament?.results?.matches?.[2]?.winnerId) { //works fine, because don't have winnerId based on 2 opponents
			console.log("closeTournament after 5sec\n: ", tournament);
			closeTournament();
			navigate('/board', { replace: true });
			// timer = setTimeout(() => {
			// }, DELAY_MS);
		}

		if (tournament?.results?.matches?.[0]?.winnerId) {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				navigate(`/game/1vs1?phase=${nextPhase}`, { state: { from: location.pathname } });
			}, DELAY_MS);
			console.log("go to nextPhase after 5sec\n");
		}

		return () => {
            if (timer) clearTimeout(timer);
        };
	}, [isTournamentOver, closeTournament, navigate]);


	function handleInputChange(e: ChangeEvent<HTMLInputElement>, index: number): void {
		const { value } = e.target;
		setUsernames(prevNames => {
			const newNames = [... prevNames];
			newNames[index] = value;
			return newNames;
		});
	}

	async function handleFormSubmit(challengers: MatchUsersTemp[]) { //, phase? already init
		console.log("challengers in handleFormSubmit in Tournament.tsx: ", challengers);
		updateMatches(user, { challengers: challengers, phase: nextPhase });
		navigate(`/game/1vs1?phase=${nextPhase}`);
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
			{
				!tournament?.results?.challengers?.[1].name &&
					<UsernameInput mode={"tournament"} users={usernames} onChange={handleInputChange} onSubmit={handleFormSubmit} words={words} />
			}
			<Tournament words={words} />
			<div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: '#214241', opacity: '50%'}}></div>
		</div>
	);
}
