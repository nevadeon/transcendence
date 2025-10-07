// Stocke toutes les sessions de jeu actives.
const activeGames = {};

export function createGameSession(gameId, io) {
    const state = getInitialState();
    state.gameId = gameId;
    activeGames[gameId] = state;

    // Le Game Loop
    const gameLoop = setInterval(() => {
        if (!state.isRunning) {
            clearInterval(gameLoop);
            // Si le jeu est terminé, on supprime la session de jeu
            delete activeGames[gameId]; 
            return;
        }

        // 1. Appliquer le Mouvement des Pads
        updatePads(state);

        // 2. Appliquer la Physique de la Balle (à implémenter)
        const scored = updateBallPhysics(state);

        if (scored) {
            // Un point a été marqué, vérifier la fin de partie
            if (state.score.p1 >= MAX_SCORE || state.score.p2 >= MAX_SCORE) {
                state.isRunning = false;
                const winnerId = state.score.p1 > state.score.p2 ? 1 : 2;

                // Envoyer la fin de partie à tous les clients dans cette salle (ici, un seul)
                io.to(gameId).emit('gameOver', {
                    winnerId,
                    finalScore: `${state.score.p1}-${state.score.p2}`,
                    gameType: '1v1'
                });
                // TODO: Logique pour enregistrer le résultat dans le service user-stats
            }
        }

        // 3. Envoyer le nouvel état aux clients (sans les données de physique interne)
        io.to(gameId).emit('gameState', {
            pads: state.pads,
            ball: { x: state.ball.x, y: state.ball.y },
            score: state.score
        });

    }, GAME_TICK); 

    return state;
}

// Fonction utilitaire pour limiter une valeur dans une plage
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function updatePads(state) {
    // Le Game Loop met à jour la position Y des pads en fonction des inputs
    for (const padId of [1, 2]) {
        if (state.inputs[padId] !== 0) {
            const currentY = state.pads[padId];
            const newY = currentY + (state.inputs[padId] * PAD_SPEED);

            // S'assurer que le pad reste dans l'arène (entre le bord supérieur et le bord inférieur)
            // La position est mesurée au centre du pad.
            state.pads[padId] = clamp(
                newY, 
                PAD_HEIGHT / 2, 
                ARENA_HEIGHT - PAD_HEIGHT / 2
            );
        }
    }
}

function updateBallPhysics(state) {
    // 💡 TODO : Cette fonction est la plus complexe et nécessite la gestion des collisions
    // Pour l'instant, on fait bouger la balle et on gère les rebonds sur les murs HAUT/BAS.

    // 1. Mise à jour de la position de la balle
    state.ball.x += state.ball.vx;
    state.ball.y += state.ball.vy;

    // 2. Rebond sur les murs HAUT et BAS
    const ballTop = state.ball.y - BALL_SIZE / 2;
    const ballBottom = state.ball.y + BALL_SIZE / 2;

    if (ballTop <= 0 || ballBottom >= ARENA_HEIGHT) {
        state.ball.vy *= -1; // Inverse la direction Y
        state.ball.vy *= 1.05; // Augmente légèrement la vitesse (bonus)
        // Correction de la position pour ne pas coller au mur
        state.ball.y = clamp(state.ball.y, BALL_SIZE / 2, ARENA_HEIGHT - BALL_SIZE / 2);
    }

    // 3. Détection de Score (mur GAUCHE ou DROIT)
    if (state.ball.x < 0 || state.ball.x > ARENA_WIDTH) {
        const scorer = state.ball.x < 0 ? 'p2' : 'p1';
        state.score[scorer]++;

        // Réinitialiser la balle au centre et inverser la direction de départ
        state.ball.x = ARENA_WIDTH / 2;
        state.ball.y = ARENA_HEIGHT / 2;
        state.ball.vx = (scorer === 'p1' ? -8 : 8); // La balle repart du côté du perdant
        state.ball.vy = Math.random() > 0.5 ? 4 : -4;
        return true; // Un point a été marqué
    }
    // 4. Détection de Collision avec les Pads (À IMPLÉMENTER EN DÉTAIL)
    // ... Logique de collision et de rebond sur les pads ici ...
    return false;
}