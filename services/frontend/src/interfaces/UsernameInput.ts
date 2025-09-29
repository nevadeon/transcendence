import type { LanguageContextType } from "./Language";

export interface UsernameInputProps {
	mode?: string,
	onSubmit: (usernames: string[]) => void
	words: LanguageContextType
}