import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

interface GameState {
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

export default function usePongGame(gameMode: string, userId: number) {
	const [gameState, setGameState] = useState<GameState | null>(null);
    const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		// 1. Initialiser la connexion
		const socket = io('http://localhost:3002'); // À remplacer par votre URL de Fastify
		socketRef.current = socket;
		// 2. Événement de connexion réussi (envoyer l'ID pour rejoindre le salon)
		socket.on('connect', () => {
			socket.emit('joinGame', { mode: gameMode, playerId: userId });
		});
		// 3. Écouter l'état du jeu
		socket.on('gameState', (state: GameState) => {
			setGameState(state);
		});
		// 4. Écouter la fin de partie (pour sauvegarder)
		socket.on('gameOver', (results: any) => {
			// Logique de navigation/sauvegarde ici
			console.log("Jeu terminé, résultats:", results);
		});

		return () => { socket.disconnect(); };
	}, [gameMode, userId]);

	const sendInput = (direction: 'up' | 'down', action: 'start' | 'stop', padId: number) => {
		socketRef.current?.emit('move', { direction, action, padId });
	};

    return { gameState, sendInput };
};