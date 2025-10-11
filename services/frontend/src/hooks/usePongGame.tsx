import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

export interface GameState {
    pads: {
        [id: number]: number;
    };
    ball: {
        x: number;
        y: number;
    };
    score: {
        p1: number;
        p2: number;
    };
}

export interface UsersTemp {
    name: string;
    avatar: string;
}

export interface GameResults {
    winnerId: number;
    scoreLeft: number;
    scoreRight: number;
}

const INTERPOLATION_DELAY_MS = 50;

export default function usePongGame(gameMode: string, mainUser: UsersTemp | undefined, usersTemp: UsersTemp[]) {
	const socketRef = useRef<Socket | null>(null);
	const stateHistoryRef = useRef<Array<GameState & { receivedAt: number }>>([]);
	const [gameState, setGameState] = useState<GameState | null>(null);
	const [gameResults, setGameResults] = useState<GameResults | null>(null);

	useEffect(() => {
		const socket = io('http://localhost:3002');
		socketRef.current = socket;
		socket.on('connect', () => {
			socket.emit('joinGame', {
                mode: gameMode,
                mainUser: mainUser,
                usersTemp: usersTemp
            });
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
            setGameResults(results);
			console.log("Jeu terminé, résultats:", results);
		});

		return () => { socket.disconnect(); };
	}, []);


    useEffect(() => {
        let frameId: number;
        const interpolate = () => {
			const history = stateHistoryRef.current;
            if (history.length < 2) {
                frameId = requestAnimationFrame(interpolate);
                return;
            }
            const renderTime = Date.now() - INTERPOLATION_DELAY_MS;
            let stateA = null;
            let stateB = null;
            for (let i = 0; i < history.length; i++) {
                if (history[i].receivedAt >= renderTime) {
                    stateB = history[i];
                    stateA = history[i - 1]; // L'état A est le précédent
                    break;
                }
            }
			if (!stateA || !stateB) {
                setGameState(history[history.length - 1]);
            } else {
                const totalTime = stateB.receivedAt - stateA.receivedAt;
                const progressTime = renderTime - stateA.receivedAt;
                const alpha = Math.max(0, Math.min(1, progressTime / totalTime));
                const newBallX = stateA.ball.x + (stateB.ball.x - stateA.ball.x) * alpha;
                const newBallY = stateA.ball.y + (stateB.ball.y - stateA.ball.y) * alpha;
                const interpolatedPads: GameState['pads'] = {};
                for (const padId in stateA.pads) {
                    const id = parseInt(padId);
                    if (stateB.pads[id] !== undefined) {
                        interpolatedPads[id] = stateA.pads[id] + (stateB.pads[id] - stateA.pads[id]) * alpha;
                    } else {
                        interpolatedPads[id] = stateA.pads[id];
                    }
                }
                setGameState({
                    pads: interpolatedPads,
                    ball: { x: newBallX, y: newBallY },
                    score: stateB.score,
                } as GameState);
			}
            frameId = requestAnimationFrame(interpolate);
        };
        frameId = requestAnimationFrame(interpolate);
        return () => cancelAnimationFrame(frameId);
    }, []);

	const sendInput = (direction: 'up' | 'down', action: 'start' | 'stop', padId: number) => {
		socketRef.current?.emit('move', { direction, action, padId });
	};

    return { gameState, gameResults, sendInput };
};