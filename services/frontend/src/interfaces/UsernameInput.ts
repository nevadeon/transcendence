import type { ChangeEvent } from "react";
import type { LanguageContextType } from "./Language";
import type { MatchUsersTemp } from "./Tournament";

export interface UsernameInputProps {
	mode?: string,
	users: string[],
	onChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void,
	onSubmit: (challengers: MatchUsersTemp[]) => void,
	words: LanguageContextType
}