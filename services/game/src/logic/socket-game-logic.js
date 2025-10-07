import { activeGames, createGameSession } from './GameEngine';

export function setupSocketLogic(io, fastify) {
    io.on('connection', (socket) => {
        let gameId = null;

        // 1. Gérer l'arrivée dans la partie
        socket.on('joinGame', (data) => {
            // Utiliser l'ID du socket comme ID de la partie pour le 1v1 local
            gameId = socket.id; 
            socket.join(gameId); 

            // Démarrer la boucle de jeu pour cette session
            const game = createGameSession(gameId, io); 

            fastify.log.info(`New 1v1 local game started: ${gameId}`);

            // Envoyer l'état initial
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