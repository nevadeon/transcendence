import type { ChangeEvent } from "react";
import type { FormData } from "./Form";
import type { LanguageContextType } from "./Language";

export interface UsernameInputProps {
	data: FormData,
	onChange: (e:ChangeEvent<HTMLInputElement>) => void,
	words: LanguageContextType
}