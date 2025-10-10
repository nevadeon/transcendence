import { saveGameResults } from "./saveGameResults.js";

const GAME_TICK = 1000 / 60;  //60fps
const PAD_SPEED = 10;         //speed, 10 units / 1fps
const MAX_SCORE = 7;          //score to win

const ARENA_WIDTH = 1200 - 64 - 64; //#TODO
const ARENA_HEIGHT = 751;
const PAD_WIDTH = 32;
const PAD_HEIGHT = 120;
const BALL_SIZE = 48;
const PAD_POS_Y_DEFAULT = ARENA_HEIGHT / 2;

// init state of a game
const getInitialState = (gameMode) => {
    const pads = { 1: PAD_POS_Y_DEFAULT, 2: PAD_POS_Y_DEFAULT };
    const scores = { p1: 0, p2: 0 };
    const inputs = { 1: 0, 2: 0 };
    // from emit("move", { direction, action, padId }) État de mouvement reçu du client (for Game Loop)
    // 1: up, -1: down, 0: stop

    if (gameMode === '2v2') {
        pads[3] = PAD_POS_Y_DEFAULT;
        pads[4] = PAD_POS_Y_DEFAULT;
        inputs[3] = 0;
        inputs[4] = 0;
    }

    return {
        pads: pads,
        ball: {
            x: ARENA_WIDTH / 2,
            y: ARENA_HEIGHT / 2,
            vx: 4,      // init speed on x
            vy: 2,      // init speed on y
        },
        score: scores,  // Utilise la structure de score dynamique
        inputs: inputs,
        isRunning: true,
    };
};

// Stocke toutes les sessions de jeu actives.
export const activeGames = {};

export function createGameSession(fastify, gameId, io, gameMode, mainPlayer, playersTemp) {
    const state = getInitialState(gameMode);
    state.gameId = gameId;
    activeGames[gameId] = state;

    // Le Game Loop
    const gameLoop = setInterval( async () => {
        if (!state.isRunning) {
            clearInterval(gameLoop);
            delete activeGames[gameId];
            return;
        }

        updatePads(state);

        const scored = updateBallPhysics(state);

        if (scored) {
            // Un point a été marqué, vérif la fin de partie
            if (state.score.p1 >= MAX_SCORE || state.score.p2 >= MAX_SCORE) {
                state.isRunning = false;
                try {
                    await saveGameResults(fastify, state, gameMode, mainPlayer, playersTemp); //fastify -> db, log...
                } catch (err) {
                    console.error(err);
                }
                const winnerId = state.score.p1 > state.score.p2 ? 1 : 2;
                io.to(gameId).emit('gameOver', {
                    winnerId,
                    scoreLeft: state.score.p1,
                    scoreRight: state.score.p2,
                    finalScore: `${state.score.p1}-${state.score.p2}`,
                    gameType: gameMode
                });
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
    const padIds = Object.keys(state.pads).map(Number);

    for (const padId of padIds) {
        // 1. Vérif si une entrée de mouvement a été reçue pour ce pad
        // Nous vérifions à la fois l'existence de l'input et si la valeur n'est pas 0 (arrêt)
        if (state.inputs[padId] !== 0) {
            const currentY = state.pads[padId];
            const newY = currentY + (state.inputs[padId] * PAD_SPEED);

            // 2. Appliquer les limites de l'arène (clamping)
            state.pads[padId] = clamp(
                newY,
                PAD_HEIGHT / 2,         // Limite supérieure (centre du pad)
                ARENA_HEIGHT - PAD_HEIGHT / 2 // Limite inférieure (centre du pad)
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
        state.ball.vx = (scorer === 'p1' ? -4 : 4); // La balle repart du côté du perdant
        state.ball.vy = Math.random() > 0.5 ? 2 : -2;
        return true; // Un point a été marqué
    }



    // 4. Détection de Collision avec les Pads (À IMPLÉMENTER EN DÉTAIL)
    const padIds = Object.keys(state.pads).map(Number);
    const ballX = state.ball.x;
    const ballY = state.ball.y;
    const ballRadius = BALL_SIZE / 2;
    const MAX_BALL_SPEED = 15;

    for (const padId of padIds) {
        // La position Y du pad est son CENTRE (comme géré par updatePads)
        const padCenterY = state.pads[padId];
        // Définir les limites du pad
        const padTopY = padCenterY - PAD_HEIGHT / 2;
        const padBottomY = padCenterY + PAD_HEIGHT / 2;
        let padHitX;
        let isLeftPad;
        // Déterminer la position X du pad et sa direction
        if (padId === 1 || padId === 3) { // Pads de Gauche (1 et 3)
            padHitX = PAD_WIDTH; // La face du pad que la balle frappe(64px shift from left side)
            isLeftPad = true;
        } else { // Pads de Droite (2 et 4)
            padHitX = ARENA_WIDTH - PAD_WIDTH; // La face du pad que la balle frappe(64px shift from right side)
            isLeftPad = false;
        }
        // Vérif 1 : La balle est-elle à la bonne hauteur pour ce pad ?
        if (ballY + ballRadius < padTopY || ballY - ballRadius > padBottomY) {
            continue; // La balle est au-dessus ou en dessous du pad.
        }
        // Vérif 2 : La balle est-elle sur le plan X du pad ? (Collision réelle)
        let collisionOccurred = false;
        if (isLeftPad && state.ball.vx < 0) {
             // Collision Pad Gauche : La balle doit venir de la droite (vx < 0) et toucher l'avant du pad
            if (ballX - ballRadius <= padHitX && ballX - ballRadius > padHitX - state.ball.vx) {
                collisionOccurred = true;
                // Correction pour ne pas coller
                state.ball.x = padHitX + ballRadius;
            }
        } else if (!isLeftPad && state.ball.vx > 0) {
            // Collision Pad Droit : La balle doit venir de la gauche (vx > 0) et toucher l'avant du pad
            if (ballX + ballRadius >= padHitX && ballX + ballRadius < padHitX - state.ball.vx) {
                collisionOccurred = true;
                // Correction pour ne pas coller
                state.ball.x = padHitX - ballRadius;
            }
        }



        // 5. Calcul du Rebond et de l'Angle
        if (collisionOccurred) {
            // Calculer la diff entre le centre de la balle et le centre du pad
            const deltaY = ballY - padCenterY;
            // Normaliser cette distance en une valeur entre -1.0 (haut du pad) et 1.0 (bas du pad)
            // (La moitié de la hauteur est la distance maximale par rapport au centre)
            const relativeIntersectY = deltaY / (PAD_HEIGHT / 2);
            // Définir l'angle de rebond
            // Plus relativeIntersectY est grand, plus l'angle sera vertical.
            const BOUNCE_ANGLE_MAX = Math.PI / 4; // 45 degrés
            const newAngle = relativeIntersectY * BOUNCE_ANGLE_MAX;
            // Définir la nouvelle vitesse X
            // 1. Inverser la direction X
            state.ball.vx *= -1;
            // 2. Augmenter la vitesse pour un jeu plus dynamique
            let newSpeed = Math.sqrt(state.ball.vx * state.ball.vx + state.ball.vy * state.ball.vy) * 1.1;
            // Limiter la vitesse pour éviter l'explosion
            newSpeed = Math.min(newSpeed, MAX_BALL_SPEED);
            // 3. Appliquer l'angle
            state.ball.vx = newSpeed * Math.cos(newAngle);
            // Si c'est un pad de droite, inverser la direction X
            if (!isLeftPad) {
                state.ball.vx *= -1;
            }
            state.ball.vy = newSpeed * Math.sin(newAngle);
            // Sortir de la boucle pour traiter un seul rebond par tick
            return false;
        }
    }
    return false;
}