// import { createContext, useState } from "react";
// import type { OpenableElement, BoardContextType, BoardProviderProps } from "../../interfaces/Board";


// import type { ReactNode } from "react";

// export type OpenableElement = 'profile' | 'stats' | 'username' | 'addfriend' | null;

// export interface TournamentContextType {
// 	//return values...
// }

// export interface TournamentProviderProps {
// 	children: ReactNode
// }

// export interface TournamentStates {

// }

// export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// export function TournamentProvider({ children }: TournamentProviderProps) {
// 	const [tournament, setTournament] = useState<TournamentStates | null>(null);

// 	const toggleElement = (element: OpenableElement) => {
// 		setOpenElement(prev => {
// 			if (prev === element)
// 				return null;
// 			return element;
// 		});
// 	};

// 	return (
// 		<TournamentContext.Provider value={{ openElement, toggleElement }}>
// 			{children}
// 		</TournamentContext.Provider>
//   );
// }