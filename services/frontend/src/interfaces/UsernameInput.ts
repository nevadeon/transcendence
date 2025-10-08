import type { ChangeEvent } from "react";
import type { LanguageContextType } from "./Language";

export interface UsernameInputProps {
	mode?: string,
	users: string[],
	onChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void,
	onSubmit: (usernames: string[], avatars: string[]) => void,
	words: LanguageContextType
}