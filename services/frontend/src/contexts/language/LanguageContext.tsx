import { createContext, useState, useEffect, useCallback } from "react";
import type { Locale, Messages, LanguageContextType, LanguageProviderProps } from "../../interfaces/Language";
import en from "../../locales/en.json";
import fr from "../../locales/fr.json";
import es from "../../locales/es.json";

const locales: Record<Locale, Messages> = { en, fr, es };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: LanguageProviderProps) {
	const [locale, setLocaleState] = useState<Locale>(() => {
        const storedLocale = localStorage.getItem('language');
        if (storedLocale && ['en', 'fr', 'es'].includes(storedLocale)) {
            return storedLocale as Locale;
        }
        return "en";
    });
	const [messages, setMessages] = useState<Messages>(locales["en"]);

	const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('language', newLocale);
    }, []);

	useEffect(() => {
		setMessages(locales[locale]);
	}, [locale]);

	return (
		<LanguageContext.Provider value={{ locale, messages, setLocale }}>
			{children}
		</LanguageContext.Provider>
  );
}
