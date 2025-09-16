import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import router from './routes/Router.tsx'
import { LanguageProvider } from './components/LanguageContext.tsx'
import './styles/index.css'
import './styles/Auth.css'
// import './assets/start.mp3'
// + <SoundProvider /> => Settings Provider(fusion both?)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<LanguageProvider>
			<RouterProvider router={router} />
		</LanguageProvider>
	</StrictMode>,
)
