import type { LanguageContextType } from "./Language";

export interface UsernameInputProps {
	mode?: string,
	numUser: number,
	onSubmit: (usernames: string[]) => void
	words: LanguageContextType
}