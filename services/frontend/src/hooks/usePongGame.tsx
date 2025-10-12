import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Socket, io } from "socket.io-client";
import useTournament from "../contexts/tournament/useTournament";

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
    const { tournament, updateMatches } = useTournament();
    const navigate = useNavigate();

    const getNextPhase = () => {
		if (!tournament)
			return undefined;
		const matches = tournament.results?.matches;
		const nextMatch = matches?.find(match => match.winnerId === undefined);
		console.log("nextMatch: ", nextMatch);
		if (nextMatch) {
			return nextMatch.phase; // "demi1", "demi2", ou "final"
		}
		return undefined; // Le tournoi est terminé
	};
	const nextPhase = getNextPhase();

	useEffect(() => {
		const socket = io('http://localhost:3002');
		socketRef.current = socket;
		socket.on('connect', () => {
			socket.emit('joinGame', {
                mode: gameMode,
                mainUser: mainUser,
                usersTemp: usersTemp,
                phase: nextPhase
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

		socket.on('gameOver', (data) => {
			// Ne rediriger vers le tournoi que si on est explicitement en mode tournament
			// ET que le contexte tournament existe ET que la phase correspond à un tournoi
			if (tournament && gameMode === 'tournament' && data.phase && 
				(data.phase === 'demi1' || data.phase === 'demi2' || data.phase === 'final')) {
				updateMatches(mainUser || null, { matchResults: data.matchResults, phase: data.phase });
				console.log("after gameOver tournament.results: ", tournament);
				navigate('/tournament', { replace: true });
			} else {
				setGameResults(data);
				navigate('/board', { replace: true });
			}
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