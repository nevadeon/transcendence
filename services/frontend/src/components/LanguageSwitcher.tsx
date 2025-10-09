import type { MouseEventHandler } from "react";
import { useLocation } from "react-router";
import useLanguage from "../contexts/language/useLanguage";
import audioEnSource from "../assets/locales/en.svg";
import audioFrSource from "../assets/locales/fr.svg";
import audioEsSource from "../assets/locales/es.svg";
import "../styles/board/sidebar-friendlist/DeleteBtn.css";
// import "../styles/board/sidebar-friendlist/LanguageBtn.css";

const languageData = {
	en: { label: 'English', flagPath: audioEnSource },
	fr: { label: 'Français', flagPath: audioFrSource },
	es: { label: 'Español', flagPath: audioEsSource },
};

export default function LanguageSwitcher() {
	const { locale, setLocale } = useLanguage();
	const currentLanguage = languageData[locale];
	const location = useLocation();
	const path = location.pathname;

	const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
		const locales = ['en', 'fr', 'es'];
		const currentIndex = locales.indexOf(locale);
		const nextIndex = (currentIndex + 1) % locales.length;
		setLocale(locales[nextIndex] as 'en' | 'fr' | 'es');
	};

	return (
		<button
			onClick={handleClick}
			className={path === "/register" || path === "/login" ? "auth-languages" : "sidebar auth-languages"}>
			<img
				src={currentLanguage.flagPath}
				alt={`Flag of ${currentLanguage.label}`}
			/>
		</button>
	);
}
