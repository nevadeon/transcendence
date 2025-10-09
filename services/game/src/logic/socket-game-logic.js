import { activeGames, createGameSession } from './GameEngine.js';

export function setupSocketLogic(io, fastify) {
    io.on('connection', (socket) => {
        let gameId = null;

        // 1. socket.emit('joinGame', { mode: gameMode, playerId: userId });   from usePongGame.tsx
        socket.on('joinGame', (data) => {
            gameId = socket.id;
            socket.join(gameId);
            const gameMode = data.mode;
            const mainPlayer = data.mainUser; //HERE !!!
            const playersTemp = data.usersTemp;

            const game = createGameSession(fastify, gameId, io, gameMode, mainPlayer, playersTemp);

            fastify.log.info(`New 1v1 local game started: ${gameId}`);

            // 2. to socket.on('gameState', (state: GameState) => { setGameState(state); });   from usePongGame.tsx
            io.to(gameId).emit('gameState', {
                pads: game.pads,
                ball: { x: game.ball.x, y: game.ball.y },
                score: game.score
            });
        });

        // 2. Gérer les entrées de mouvement du client
        socket.on('move', (data) => {
            const game = activeGames[gameId];
            if (!game || !game.isRunning) return;

            // Mettre à jour l'état d'entrée pour que le Game Loop puisse l'utiliser
            const directionValue = data.direction === 'up' ? -1 : 1;
            const actionValue = data.action === 'start' ? directionValue : 0;

            game.inputs[data.padId] = actionValue;
            console.log(`Input reçu pour Pad ${data.padId}: ${data.action}. Nouvel input: ${game.inputs[data.padId]}. Direction: ${data.direction}`);
        });

        // 3. Gérer la déconnexion
        socket.on('disconnect', () => {
            if (gameId && activeGames[gameId]) {
                fastify.log.info(`Game session ended on disconnect: ${gameId}`);
                activeGames[gameId].isRunning = false; // Arrête la boucle de jeu
                // Note: Le GC se chargera de supprimer la session de la DB 'game_sessions'
            }
        });
    });
}