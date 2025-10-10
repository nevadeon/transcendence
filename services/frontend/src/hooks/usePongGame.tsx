import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

export interface GameState {
    // vertical pos (entre 0 et 100 pour être responsive, ou en pixels)
    pads: {
        [id: number]: number; // 1: 50, 2: 75, 3, 4
    };
    ball: {
        x: number; // pixel
        y: number;
    };
    score: {
        p1: number;
        p2: number;
    };
    // others too (ex: puissance de la balle, nom du vainqueur du set...)
}

export interface UsersTemp {
    name: string,
    avatar: string
}

const INTERPOLATION_DELAY_MS = 50;

export default function usePongGame(gameMode: string, mainUser: UsersTemp | undefined, usersTemp: UsersTemp[]) { //usersTemp: UsersTemp[]
	const socketRef = useRef<Socket | null>(null);
	const stateHistoryRef = useRef<Array<GameState & { receivedAt: number }>>([]);
	const [gameState, setGameState] = useState<GameState | null>(null);

	useEffect(() => {
		const socket = io('http://localhost:3002'); // url du back
		socketRef.current = socket;
		socket.on('connect', () => {
			socket.emit('joinGame', { mode: gameMode, mainUser: mainUser, usersTemp: usersTemp });
		});

		// interpolation logic
		socket.on('gameState', (state: GameState) => {
			const stampedState = { ...state, receivedAt: Date.now() };
            stateHistoryRef.current.push(stampedState as any);
            if (stateHistoryRef.current.length > 60) {
                stateHistoryRef.current.shift();
            }
		});

		socket.on('gameOver', (results: any) => {
            setGameResult(results);
			console.log("Jeu terminé, résultats:", results);
		});

		return () => { socket.disconnect(); };
	}, []);


    useEffect(() => {
        let frameId: number;
        const interpolate = () => {
			const history = stateHistoryRef.current;
            if (history.length < 2) {
                // Pas assez de données pour interpoler, on passe.
                frameId = requestAnimationFrame(interpolate);
                return;
            }
            const renderTime = Date.now() - INTERPOLATION_DELAY_MS;
            // 1. Trouver les deux états (A et B) qui encadrent le temps de rendu idéal (renderTime)
            let stateA = null;
            let stateB = null;
			// On cherche l'état B (premier état reçu APRÈS le temps de rendu idéal)
            for (let i = 0; i < history.length; i++) {
                if (history[i].receivedAt >= renderTime) {
                    stateB = history[i];
                    stateA = history[i - 1]; // L'état A est le précédent
                    break;
                }
            }
			// Si on ne trouve pas A et B (ex: le serveur n'envoie pas assez vite) : on utilise le plus récent
			if (!stateA || !stateB) {
                setGameState(history[history.length - 1]);
            } else {
                // 2. Calculer le facteur d'interpolation (alpha)
                const totalTime = stateB.receivedAt - stateA.receivedAt;
                const progressTime = renderTime - stateA.receivedAt;
                // Clamp pour s'assurer que alpha reste entre 0 et 1
                const alpha = Math.max(0, Math.min(1, progressTime / totalTime));
				// 3. Appliquer l'interpolation
                const newBallX = stateA.ball.x + (stateB.ball.x - stateA.ball.x) * alpha;
                const newBallY = stateA.ball.y + (stateB.ball.y - stateA.ball.y) * alpha;
				// Interpolation des pads pour tous les IDs existants
                const interpolatedPads: GameState['pads'] = {};
                for (const padId in stateA.pads) {
                    const id = parseInt(padId);
                    if (stateB.pads[id] !== undefined) {
                        interpolatedPads[id] = stateA.pads[id] + (stateB.pads[id] - stateA.pads[id]) * alpha;
                    } else {
                        interpolatedPads[id] = stateA.pads[id];
                    }
                }
				// 4. Mettre à jour l'état final (on prend les scores de l'état B car ils ne s'interpolent pas)
                setGameState({
                    pads: interpolatedPads,
                    ball: { x: newBallX, y: newBallY },
                    score: stateB.score,
                } as GameState); // Cast nécessaire à cause de l'ajout de receivedAt
			}
            frameId = requestAnimationFrame(interpolate);
        };
        // Démarrer la boucle de rendu pour le lissage
        frameId = requestAnimationFrame(interpolate);
        return () => cancelAnimationFrame(frameId);
    }, []);

	const sendInput = (direction: 'up' | 'down', action: 'start' | 'stop', padId: number) => {
		socketRef.current?.emit('move', { direction, action, padId });
	};

    return { gameState, sendInput };
};