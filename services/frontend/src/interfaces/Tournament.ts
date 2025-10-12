import type { UserDataProps } from "./UserData";
import type { LanguageContextType } from "./Language";
import type { ReactNode } from "react";
import type { UsersTemp } from "../hooks/usePongGame";

export interface TournamentProps {
	words: LanguageContextType
}

export interface TournamentProviderProps {
	children: ReactNode;
}

export interface MatchUsersTemp {
	name?: string;
	avatar?: string;
}

export interface Matches {
	phase?: string; // "demi1, demi2, final" -> retrieve in /tournament for components CSS states
	opponents?: MatchUsersTemp[]; //x2, 1vs1
	winnerId?: number; //until receive from websocket gameOver
	scoreLeft?: number; //opponents[0]
	scoreRight?: number;  //opponents[1]
}

export interface TournamentResults {
	challengers?: MatchUsersTemp[]; // handle userLogin too, x4, tournament
	matches?: Matches[]; // x2 after input see below
}

export interface TournamentStates {
	tournamentId: number;
	isTournament: boolean; //1vs1 or tournament
	mode?: string; // always as "tournament"
	results?: TournamentResults; //x1(demi1), x2(+demi2), x3(finals)
}

export interface TournamentContextType {
	tournament: TournamentStates | null;
	initTournament: (user: UserDataProps | null, randAvatars: string[]) => void;
	updateMatches: (user: UsersTemp | null, data: {
		challengers?: MatchUsersTemp[],
		phase?: string,
		matchResults?: { winnerId: number, scoreLeft: number, scoreRight: number }
	}) => void;
	closeTournament: () => void;
}