import { createContext, useState } from "react";
import type { UserDataProps } from "../../interfaces/UserData";
import type { TournamentContextType,
    TournamentProviderProps,
    TournamentStates,
    MatchUsersTemp } from "../../interfaces/Tournament";
import type { UsersTemp } from "../../hooks/usePongGame";

export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: TournamentProviderProps) {
	const [tournament, setTournament] = useState<TournamentStates | null>(null);

	function initTournament(user: UserDataProps | null, randAvatars: string[]) { //null
        console.log("initTournament: ", user, randAvatars);
        if (!user) {
            setTournament({
                tournamentId: Math.floor(Math.random() * 100000), // ID unique
                isTournament: true,
                mode: "tournament",
                results: {
                    challengers: randAvatars.map((avatar) => ({ name: undefined, avatar })),
                    matches: [
                        {
                            phase: "demi1",
                            opponents: randAvatars.slice(0, 2).map(avatar => ({ name: undefined, avatar })),
                            winnerId: undefined,
                            scoreLeft: undefined,
                            scoreRight: undefined
                        },
                        { phase: "demi2", opponents: randAvatars.slice(2, 4).map(avatar => ({ name: undefined, avatar })), winnerId: undefined, scoreLeft: undefined, scoreRight: undefined },
                        { phase: "final", opponents: [{ name: undefined, avatar: undefined }, { name: undefined, avatar: undefined }], winnerId: undefined, scoreLeft: undefined, scoreRight: undefined },
                    ],
                }
            });
            return ;
        }
        setTournament({
            tournamentId: Math.floor(Math.random() * 100000),
            isTournament: true,
            mode: "tournament",
            results: {
                challengers: randAvatars.map((avatar) => ({ name: undefined, avatar })), //set user.name + user.avatar
                matches: [
                    { phase: "demi1", opponents: [{ name: user.name, avatar: user.avatar }, { name: undefined, avatar: randAvatars[0] }], winnerId: undefined, scoreLeft: undefined, scoreRight: undefined },
                    { phase: "demi2", opponents: randAvatars.slice(1, 3).map(avatar => ({ name: undefined, avatar })), winnerId: undefined, scoreLeft: undefined, scoreRight: undefined },
                    { phase: "final", opponents: [{ name: undefined, avatar: undefined }, { name: undefined, avatar: undefined }], winnerId: undefined, scoreLeft: undefined, scoreRight: undefined },
                ],
            }
        });
    };

    // updateMatches(data: { matchResults: data });
	function updateMatches(user: UsersTemp | null, data: {
        challengers?: MatchUsersTemp[],
        phase?: string,
        matchResults?: { winnerId: number, scoreLeft: number, scoreRight: number }
    }) {
		if (!tournament) {
            console.log('check tournament in updateMatches()')
			return;
        }
        console.log("updatematches: ", data);
        setTournament(prev => {
            if (!prev)
				return null;
            // Copie profonde pour l'immutabilité
            const newTournament = JSON.parse(JSON.stringify(prev)) as TournamentStates;
            const currentResults = newTournament?.results; // Simplifié à un seul objet dans cette version
            // 1. MISE À JOUR DES NOMS DES CHALLENGERS (Appelé par /tournament après input x4)
            console.log("currentResults TournamentContext.tsx: ", currentResults);
            if (data.challengers?.length === 4
                && currentResults
                && currentResults?.matches?.[0]?.opponents?.[0]
                && currentResults?.matches?.[1]?.opponents?.[0]) {
                currentResults.challengers = data.challengers;
                currentResults.matches[0].opponents[0].name = data.challengers[0].name;
                currentResults.matches[0].opponents[1].name = data.challengers[1].name;
                currentResults.matches[1].opponents[0].name = data.challengers[2].name;
                currentResults.matches[1].opponents[1].name = data.challengers[3].name;
            } else if (data.challengers?.length === 3
                && currentResults
                && currentResults?.matches?.[0]?.opponents?.[0]
                && currentResults?.matches?.[1]?.opponents?.[0]) {
                currentResults.challengers = data.challengers;
                currentResults.matches[0].opponents[1].name = data.challengers[0].name;
                currentResults.matches[1].opponents[0].name = data.challengers[1].name;
                currentResults.matches[1].opponents[1].name = data.challengers[2].name;
            }
            // 2. MISE À JOUR DES RÉSULTATS DE MATCH (Appelé par /game/1vs1 après WebSocket 'gameOver')
            console.log('between updates(after inputs, before gameOver results)')
            if (data.matchResults && currentResults?.matches) {
                
                console.log("data.phase after checking matchResults: ", data.phase)
                const matchIndex = currentResults.matches.findIndex(m => m.phase === data.phase);
                console.log("matchIndex: ", matchIndex)
                if (matchIndex !== -1) {
                    const matchToUpdate = currentResults.matches[matchIndex];
                    console.log("matchIndex: ", matchIndex, ", matchToUpdate: ", matchToUpdate, 'test')
                    currentResults.matches[matchIndex].winnerId = data.matchResults.winnerId;
                    currentResults.matches[matchIndex].scoreLeft = data.matchResults.scoreLeft;
                    currentResults.matches[matchIndex].scoreRight = data.matchResults.scoreRight;

                    // && currentResults?.matches?.[2].opponents?.[0]
                    if (data.phase === 'demi1' || data.phase === 'demi2') {
                        const demi1Winner = currentResults.matches[0].winnerId;
                        const demi2Winner = currentResults.matches[1].winnerId;
                        console.log("demi1Winner: ", demi1Winner, "demi2Winner: ", demi2Winner);

                        if (demi1Winner !== undefined && demi2Winner !== undefined && currentResults.challengers
                            && currentResults?.matches?.[2]?.opponents?.[0]
                            && currentResults?.matches?.[2]?.opponents?.[1]) {
                                if (!user) { //don't have challengers from 'gameOver' !!!
                                    const demi1WinnerData = currentResults.challengers[demi1Winner === 1 ? 0 : 1];
                                    const demi2WinnerData = currentResults.challengers[demi2Winner === 1 ? 2 : 3];

                                    currentResults.matches[2].opponents[0] = demi1WinnerData;
                                    currentResults.matches[2].opponents[1] = demi2WinnerData;
                                    return newTournament;
                                }
                                let demi1WinnerData: MatchUsersTemp = {};
                                demi2Winner === 1
                                    ? demi1WinnerData = { name: user?.name, avatar: user?.avatar }
                                    : demi1WinnerData = currentResults.challengers[0];
                                const demi2WinnerData = currentResults.challengers[demi2Winner === 1 ? 1 : 2]; //challengers[1] vs [2]

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
