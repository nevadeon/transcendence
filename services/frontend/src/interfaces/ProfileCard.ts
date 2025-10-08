import type { LanguageContextType } from "./Language";

export interface ProfileCardProps {
	id: number,
	avatar: string,
	username: string,
	dimension: string,
	ingame: boolean,
	isElim: boolean,
	words: LanguageContextType
}