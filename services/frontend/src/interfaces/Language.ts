import type { ReactNode } from "react";

import fr from "../locales/fr.json";

export type Locale = "en" | "fr" | "es";
export type Messages = typeof fr;
export type LanguageContextType = {
	locale: Locale;
	messages: Messages;
	setLocale: (lang: Locale) => void;
};

export interface LanguageProviderProps {
	children: ReactNode
}