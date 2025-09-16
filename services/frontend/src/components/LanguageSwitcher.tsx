import type { MouseEventHandler } from "react";
import useLanguage from "../contexts/language/useLanguage";

const languageData = {
	en: { label: 'English', flagPath: '../assets/locales/en.svg' },
	fr: { label: 'Français', flagPath: '../assets/locales/fr.svg' },
	es: { label: 'Español', flagPath: '../assets/locales/es.svg' },
};

export default function LanguageSwitcher() {
	const { locale, setLocale } = useLanguage();
	const currentLanguage = languageData[locale];

	const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
		const locales = ['en', 'fr', 'es'];
		const currentIndex = locales.indexOf(locale);
		const nextIndex = (currentIndex + 1) % locales.length;
		setLocale(locales[nextIndex] as 'en' | 'fr' | 'es');
	};

    return (
		<button onClick={handleClick} className="auth-languages">
			<img
				src={currentLanguage.flagPath}
				alt={`Flag of ${currentLanguage.label}`}
			/>
		</button>
	);
}
