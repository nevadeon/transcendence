import { createContext, useState } from "react";
import type { ReactNode } from "react";


// /tournament inputs onSubmit -> { update(phase: "demi1", challengers[x4], mode) } = useTournament();
// in 1vs1, useLocation just for 1vs1 mode, useTournament instead as values
// challengers[x4]
// [{name: 'loginName', avatar}, {name: 'input1Name', ...}, {name: 'input2Name', ...}, {name: 'input3Name', ...}]
// [{name: 'input1Name', avatar}, {name: 'input2Name', ...}, {name: 'input3Name', ...}, {name: 'input4Name', ...}]
// "demi1" = [0] vs [1], "demi2" = [2] vs [3]
// final = "demi1" winnerId(2) = [1] vs "demi2" winnerId(1) = [2]

// !!! ALL 1vs1 matches are saved in db if user's login !!!
// useTournament context to handle state to /tournament only

// types:
// status = "not" | "in_progress" | "complete"
// ...
// useContext approach (F5 (tournament === null && mode === "tournament") -> navigate(/board)
//  + alert(), backward navigate('/board', { replace: true }) )
// -> /tournament
//		random avatars x3 or x4 directly(at load)
//		{ user } = useAuth();
//		handleRandomAvatars(user.avatar, 4, null);
// 		{ tournament } = useTournament();
//		initTournament(randAvatars);
// 		tournament.results.challengers(from user.(name + avatar.slice(9)) + inputs(names + avatars(random)))
// 		onSubmit() -> navigate('/game/1vs1', { !nothing! }); useTournament instead

// -> /1vs1
// 		{ tournament } = useTournament();
//		...
// 		saved in db.match_history, db.users_stats as gameMode = "tournament"
// -> tournament({ demi1: results })
// -> 1vs1(if useLocation(state.tournament === true)), saved in db.match_history, db.users_stats as tournament
// -> tournament({ demi1: results, demi2: results })
// -> 1vs1(if useLocation(state.tournament === true)), saved in db.match_history, db.users_stats as tournament
// -> tournament({ demi1: results, demi2: results, final: results })
// -> board

export interface TournamentContextType {
	tournament: TournamentStates | null;
	initTournament: (randAvatars: string[]) => void;
	updateMatches: () => void;
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
	// (demi1 = challengers[0] vs [1], demi2 = challengers[2] vs [3]), final = winnerId vs winnerId
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

	function initTournament(randAvatars: string[]) {
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
                        if (demi1Winner !== null && demi2Winner !== null) {
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
