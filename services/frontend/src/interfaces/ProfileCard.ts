import type { LanguageContextType } from "./Language";

export interface ProfileCardProps {
	id: number,
	avatar?: string,
	username?: string,
	species: string,
	planet: string,
	dimension: string,
	ingame: boolean,
	isElim: boolean,
	words: LanguageContextType
}