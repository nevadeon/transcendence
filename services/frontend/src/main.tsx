import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import router from './routes/Router.tsx'
import { AuthProvider } from './contexts/auth/AuthContext.tsx'
import { LanguageProvider } from './contexts/language/LanguageContext.tsx'
import { BoardProvider } from './contexts/board/BoardContext.tsx'
import './styles/index.css'
// import './assets/start.mp3'
// + <SoundProvider /> => Settings Provider(fusion both?)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
			<AuthProvider>
				<LanguageProvider>
					<BoardProvider>
						<RouterProvider router={router} />
					</BoardProvider>
				</LanguageProvider>
			</AuthProvider>
	</StrictMode>,
)
