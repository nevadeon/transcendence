import type { LanguageContextType } from "./Language";

export default interface ContactsProps {
	iconUrl: string;
	name: string;
	isOnline: boolean;
	words: LanguageContextType;
};
