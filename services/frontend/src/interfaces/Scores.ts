import type { LanguageContextType } from "./Language";

interface ControlKeys {
  upKey: string;
  downKey: string;
}

export interface ScoresProps {
	avatar: string,
	avatar2?: string,
	name: string | null,
	name2?: string,
	result: number,
	ctrl: ControlKeys,
	ctrl2?: ControlKeys,
    isAI: boolean,
	words: LanguageContextType
}
