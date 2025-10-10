import { createContext, useState } from "react";
import type { OpenableElement, BoardContextType, BoardProviderProps } from "../../interfaces/Board";


import type { ReactNode } from "react";

export type OpenableElement = 'profile' | 'stats' | 'username' | 'addfriend' | null;

export interface TournamentContextType {
	//return values...
}

export interface TournamentProviderProps {
	children: ReactNode
}

export interface TournamentStates {

}

// types:
// status = "not" | "in_progress" | "complete"
// ...
// useContext approach (F5 (if state.tournament === true && status: "complete") -> navigate(/board) + alert(if ), backward / foreward)
// -> tournament({ demi1:  null } -> inputs)
// -> 1vs1( if useLocation(state.tournament === true && status: "in_progress") ), saved in db.match_history, db.users_stats as tournament
// -> tournament({ demi1: results })
// -> 1vs1(if useLocation(state.tournament === true)), saved in db.match_history, db.users_stats as tournament
// -> tournament({ demi1: results, demi2: results })
// -> 1vs1(if useLocation(state.tournament === true)), saved in db.match_history, db.users_stats as tournament
// -> tournament(demi1, demi2, final)
// -> board

export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: TournamentProviderProps) {
	const [tournament, setTournament] = useState<TournamentStates | null>(null);

	const toggleElement = (element: OpenableElement) => {
		setOpenElement(prev => {
			if (prev === element)
				return null;
			return element;
		});
	};

	return (
		<TournamentContext.Provider value={{ openElement, toggleElement }}>
			{children}
		</TournamentContext.Provider>
  );
}