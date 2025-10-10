import type { LanguageContextType } from "./Language";

export interface TournamentProps {
	users:string[],
	winnerA:string,
	winnerB:string,
	words: LanguageContextType
}