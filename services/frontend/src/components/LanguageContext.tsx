import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import es from "../locales/es.json";

type Locale = "en" | "fr" | "es";
type Messages = typeof fr;

type LanguageContextType = {
	locale: Locale;
	messages: Messages;
	setLocale: (lang: Locale) => void;
};

interface LanguageProviderProps {
	children: React.ReactNode
}

const locales: Record<Locale, Messages> = { en, fr, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: LanguageProviderProps) {
	const [locale, setLocale] = useState<Locale>("en");
	const [messages, setMessages] = useState<Messages>(locales["en"]);

	useEffect(() => {
		setMessages(locales[locale]);
	}, [locale]);

	return (
		<LanguageContext.Provider value={{ locale, messages, setLocale }}>
			{children}
		</LanguageContext.Provider>
  );
}

export function useLanguage() {
	const ctx = useContext(LanguageContext);
	if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
	return ctx;
}
