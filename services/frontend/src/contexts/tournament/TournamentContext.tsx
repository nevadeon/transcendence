import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { UserDataProps } from "../../interfaces/UserData";

export interface TournamentContextType {
	tournament: TournamentStates | null;
	initTournament: (user: UserDataProps, randAvatars: string[]) => void;
	updateMatches: (data: {
        challengers?: MatchUsersTemp[],
        phase?: string,
        matchResults?: { winnerId: number, scoreLeft: number, scoreRight: number }
    }) => void;
	closeTournament: () => void;
}

export interface TournamentProviderProps {
	children: ReactNode;
}

export interface MatchUsersTemp {
	name: string | null;
	avatar: string | null;
}

export interface Matches {
	phase: string; // "demi1, demi2, final" -> retrieve in /tournament for components CSS states
	opponents: MatchUsersTemp[]; //x2, 1vs1
	winnerId: number | null; //until receive from websocket gameOver
	scoreLeft: number | null; //opponents[0]
	scoreRight: number | null;  //opponents[1]
}

export interface TournamentResults {
	challengers: MatchUsersTemp[] | null; // handle userLogin too, x4, tournament
	matches: Matches[]; // x2 after input see below
}

export interface TournamentStates {
	tournamentId: number;
	isTournament: boolean; //1vs1 or tournament
	mode: string; // always as "tournament", not 1vs1
	results: TournamentResults; //x1(demi1), x2(+demi2), x3(finals)
}

export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: TournamentProviderProps) {
	const [tournament, setTournament] = useState<TournamentStates | null>(null);

	function initTournament(user: UserDataProps, randAvatars: string[]) {
        console.log(randAvatars);
        if (randAvatars.length === 4) {
            setTournament({
                tournamentId: Math.floor(Math.random() * 100000), // ID unique
                isTournament: true,
                mode: "tournament",
                results: { // J'ai simplifié results à être un seul objet TournamentResults
                    challengers: randAvatars.map((avatar) => ({ name: null, avatar })),
                    matches: [
                        { phase: "demi1", opponents: randAvatars.slice(0, 2).map(avatar => ({ name: null, avatar })), winnerId: null, scoreLeft: null, scoreRight: null },
                        { phase: "demi2", opponents: randAvatars.slice(2, 4).map(avatar => ({ name: null, avatar })), winnerId: null, scoreLeft: null, scoreRight: null },
                        { phase: "final", opponents: [{ name: null, avatar: null }, { name: null, avatar: null }], winnerId: null, scoreLeft: null, scoreRight: null },
                    ],
                }
            });
        } else if (randAvatars.length === 3) {
            setTournament({
                tournamentId: Math.floor(Math.random() * 100000), // ID unique
                isTournament: true,
                mode: "tournament",
                results: { // J'ai simplifié results à être un seul objet TournamentResults
                    challengers: randAvatars.map((avatar) => ({ name: null, avatar })),
                    matches: [
                        { phase: "demi1", opponents: [{ name: user.name, avatar: user.avatar }, { name: null, avatar: randAvatars[0] }], winnerId: null, scoreLeft: null, scoreRight: null },
                        { phase: "demi2", opponents: randAvatars.slice(1, 3).map(avatar => ({ name: null, avatar })), winnerId: null, scoreLeft: null, scoreRight: null },
                        { phase: "final", opponents: [{ name: null, avatar: null }, { name: null, avatar: null }], winnerId: null, scoreLeft: null, scoreRight: null },
                    ],
                }
            });
        }
    };

	function updateMatches(data: {
        challengers?: MatchUsersTemp[],
        phase?: string,
        matchResults?: { winnerId: number, scoreLeft: number, scoreRight: number }
    }) {
		if (!tournament)
			return;
        setTournament(prev => {
            if (!prev)
				return null;
            // Copie profonde pour l'immutabilité
            const newTournament = JSON.parse(JSON.stringify(prev)) as TournamentStates;
            const currentResults = newTournament.results; // Simplifié à un seul objet dans cette version
            // 1. MISE À JOUR DES NOMS DES CHALLENGERS (Appelé par /tournament après input)
            if (data.challengers) {
                currentResults.challengers = data.challengers;
                currentResults.matches[0].opponents[0].name = data.challengers[0].name;
                currentResults.matches[0].opponents[1].name = data.challengers[1].name;
                currentResults.matches[1].opponents[0].name = data.challengers[2].name;
                currentResults.matches[1].opponents[1].name = data.challengers[3].name;
            }
            // 2. MISE À JOUR DES RÉSULTATS DE MATCH (Appelé par /game/1vs1 après WebSocket 'gameOver')
            if (data.phase && data.matchResults) {
                const matchIndex = currentResults.matches.findIndex(m => m.phase === data.phase);
                if (matchIndex !== -1) {
                    const matchToUpdate = currentResults.matches[matchIndex];
                    matchToUpdate.winnerId = data.matchResults.winnerId;
                    matchToUpdate.scoreLeft = data.matchResults.scoreLeft;
                    matchToUpdate.scoreRight = data.matchResults.scoreRight;

                    if (data.phase === 'demi1' || data.phase === 'demi2') {
                        const demi1Winner = currentResults.matches[0].winnerId;
                        const demi2Winner = currentResults.matches[1].winnerId;

                        if (demi1Winner !== null && demi2Winner !== null && currentResults.challengers) {
                            const demi1WinnerData = currentResults.challengers[demi1Winner === 1 ? 0 : 1];
                            const demi2WinnerData = currentResults.challengers[demi2Winner === 1 ? 2 : 3];
                            currentResults.matches[2].opponents[0] = demi1WinnerData;
                            currentResults.matches[2].opponents[1] = demi2WinnerData;
                        }
                    }
                }
            }
            return newTournament;
        });
	};

	function closeTournament() {
		setTournament(null);
	}

	return (
		<TournamentContext.Provider value={{ tournament, initTournament, updateMatches, closeTournament }}>
			{children}
		</TournamentContext.Provider>
  );
}
