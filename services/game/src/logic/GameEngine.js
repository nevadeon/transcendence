import { saveGameResults } from "./saveGameResults.js";

const SCORE_TO_WIN = 3;
const GAME_TICK_MS = 1000 / 60;
const AI_REFRESH_RATE = 1000;


const ARENA_WIDTH = 1200;
const ARENA_HEIGHT = 751;
const BALL_DIAMETER = 48;
const BALL_MAX_SPEED = 20;
const PAD_SPEED = 10;
const PAD_WIDTH = 32;
const PAD_HEIGHT = 120;
const PAD_OFFSET_X = 64;
const PAD_OFFSET_X_2V2 = 32;

// export const activeGames = {};

function getInitialState(gameMode) {
    const pads = {
        1: {
            x: PAD_OFFSET_X,
            y: ARENA_HEIGHT / 2,
            directionY: 0
        },
        2: {
            x: ARENA_WIDTH - PAD_OFFSET_X - PAD_WIDTH,
            y: ARENA_HEIGHT / 2,
            directionY: 0
        },
    };
    if (gameMode === '2v2') {
        pads[3] = {
            x: PAD_OFFSET_X_2V2,
            y: ARENA_HEIGHT / 2,
            directionY: 0
        };
        pads[4] = {
            x: ARENA_WIDTH - PAD_OFFSET_X_2V2 - PAD_WIDTH,
            y: ARENA_HEIGHT / 2,
            directionY: 0
        };
    }

    const scores = { p1: 0, p2: 0 };

    return {
        pads: pads,
        ball: {
            x: ARENA_WIDTH / 2,
            y: ARENA_HEIGHT / 2,
            vx: 4,
            vy: 2,
        },
        score: scores,
        isRunning: true,
        gameMode: gameMode,
        lastAiUpdate: performance.now(),
    };
};

// Stocke toutes les sessions de jeu actives.
export const activeGames = {};

export function createGameSession(fastify, gameId, io, gameMode, mainPlayer, playersTemp, phase) {
    const state = getInitialState(gameMode);
    if (gameMode === 'versusIa') state.aiPadId = 2;
    state.gameId = gameId;
    activeGames[gameId] = state;
    let tickRunning = false;

    const gameLoopId = setInterval(async () => {
        if (tickRunning) return;
        tickRunning = true;
        if (!state.isRunning) {
            clearInterval(gameLoopId);
            delete activeGames[gameId];
            return;
        }

        updatePads(state);

        const scored = updateBallPhysics(state);
        if (scored) {
            if (state.score.p1 >= SCORE_TO_WIN || state.score.p2 >= SCORE_TO_WIN) {
                state.isRunning = false;
                try {
                    await saveGameResults(fastify, state, gameMode, mainPlayer, playersTemp); //fastify -> db, log...
                } catch (err) {
                    console.error(err);
                }
                const winnerId = state.score.p1 > state.score.p2 ? 1 : 2;
				 io.to(gameId).emit('gameOver', {
                    matchResults: {
                        winnerId: winnerId,
                        scoreLeft: state.score.p1,
                        scoreRight: state.score.p2,
                    },
                    phase: phase
                });
            }
        }

        io.to(gameId).emit('gameState', {
            pads: Object.fromEntries(
                Object.entries(state.pads).map(([padId, pad]) => [padId, pad.y])
            ),
            ball: { x: state.ball.x, y: state.ball.y },
            score: state.score
        });
        tickRunning = false;
    }, GAME_TICK_MS);

    //

    return state;
}

// Fonction utilitaire pour limiter une valeur dans une plage
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function updateIa(state) {
    if (!state.aiPadId) return;
    const now = performance.now();
    if (now - state.lastAiUpdate < AI_REFRESH_RATE) return;

    // predict intersection with the AI pad's X and store target Y
    const pad = state.pads[state.aiPadId];
    if (!pad) return;

    const targetX = pad.x + PAD_WIDTH / 2;
    const predictedY = predictYAtX(state.ball, targetX, BALL_MIN_HEIGHT, BALL_MAX_HEIGHT);
    if (predictedY != null) {
        pad.aiTargetY = predictedY;
    }

    state.lastAiUpdate = now;
}

// Predict the Y position where the ball center will be when its X equals targetX.
// Accounts for vertical bounces between yMin and yMax by folding the line with a triangle wave.
function predictYAtX(ball, targetX, yMin, yMax) {
    const vx = ball.vx;
    const vy = ball.vy;
    if (vx === 0) return null; // no horizontal motion
    const t = (targetX - ball.x) / vx;
    if (t < 0) return null; // moving away

    const yRaw = ball.y + vy * t;
    const span = yMax - yMin;
    const period = 2 * span;
    // positive modulo for floats
    let m = ((yRaw - yMin) % period + period) % period;
    if (m <= span) return yMin + m;
    return yMax - (m - span);
}

const PAD_MIN_HEIGHT = PAD_HEIGHT / 2 + BALL_DIAMETER + 20;
const PAD_MAX_HEIGHT = ARENA_HEIGHT - PAD_HEIGHT / 2 - BALL_DIAMETER - 20;
function updatePads(state) {
    if (state.aiPadId) updateIa(state);
    const padIds = Object.keys(state.pads).map(Number);
    const ball = state.ball;
    for (const padId of padIds) {
        const pad = state.pads[padId];

        let directionY = pad.directionY;
        if (padId === state.aiPadId && pad.aiTargetY != null) {
            const diff = pad.aiTargetY - pad.y;
            if (Math.abs(diff) < PAD_SPEED) {
                pad.y = clamp(pad.aiTargetY, PAD_MIN_HEIGHT, PAD_MAX_HEIGHT);
                pad.aiTargetY = null;
                continue;
            }
            directionY = diff > 0 ? 1 : -1;
        }

        if (directionY === 0) continue;

        const nextY = pad.y + (directionY * PAD_SPEED);
        const clampedY = clamp(nextY, PAD_MIN_HEIGHT, PAD_MAX_HEIGHT);

        // Compute pad rect at proposed position and test against ball circle
        // const padLeft = pad.x;
        // const padRight = pad.x + PAD_WIDTH;
        // const padTop = clampedY - PAD_HEIGHT / 2;
        // const padBottom = clampedY + PAD_HEIGHT / 2;

        // const closestX = Math.max(padLeft, Math.min(ball.x, padRight));
        // const closestY = Math.max(padTop, Math.min(ball.y, padBottom));
        // const dx = ball.x - closestX;
        // const dy = ball.y - closestY;
        // const dist2 = dx * dx + dy * dy;
        // const ballRadius = BALL_DIAMETER / 2;
        // if (dist2 < ballRadius * ballRadius) continue;

        pad.y = clampedY;
    }
}

// // This detects collision between two objects
// function hitBoxesOverlap(box1, box2) {
//     return (box1.right >= box2.left &&
//             box1.left <= box2.right &&
//             box1.bottom >= box2.top &&
//             box1.top <= box2.bottom);
// }

const BALL_RADIUS = BALL_DIAMETER / 2;
const BALL_MIN_HEIGHT = BALL_RADIUS;
const BALL_MAX_HEIGHT = ARENA_HEIGHT - BALL_RADIUS;
function updateBallPhysics(state) {
    const ball = state.ball;

    const prevX = ball.x;
    const prevY = ball.y;
    ball.x += ball.vx;
    ball.y += ball.vy;
    const ballTop = ball.y - BALL_RADIUS;
    const ballBottom = ball.y + BALL_RADIUS;

    // Bounce on top/bottom walls
    if (ballTop <= 16 || ballBottom >= ARENA_HEIGHT - 16) {
        ball.vy *= -1;
        ball.y = clamp(ball.y, BALL_MIN_HEIGHT, BALL_MAX_HEIGHT);

        let speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        speed = Math.min(BALL_MAX_SPEED, Math.max(1, speed * 1.04));
        const norm = Math.max(1e-6, Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy));
        ball.vx = (ball.vx / norm) * speed;
        ball.vy = (ball.vy / norm) * speed;
        return false;
    }

    // Scoring
    if (ball.x < 40 || ball.x > ARENA_WIDTH - 40) {
        const scorer = ball.x < ARENA_WIDTH / 2 ? 'p2' : 'p1';
        state.score[scorer]++;
        ball.x = ARENA_WIDTH / 2;
        ball.y = ARENA_HEIGHT / 2;
        ball.vx = (scorer === 'p1' ? 4 : -4);
        ball.vy = (Math.random() - 0.5) * 8;
        return true;
    }

    // Collision with pads
    const padIds = Object.keys(state.pads).map(Number);
    for (const padId of padIds) {
        const pad = state.pads[padId];
        // Paul decided that pad.x is the left X of pad and pad.y is center Y
        const padLeft = pad.x;
        const padRight = pad.x + PAD_WIDTH;
        const padTop = pad.y - PAD_HEIGHT / 2;
        const padBottom = pad.y + PAD_HEIGHT / 2;

        // Find closest point on rectangle to circle center
        const closestX = Math.max(padLeft, Math.min(ball.x, padRight));
        const closestY = Math.max(padTop, Math.min(ball.y, padBottom));

        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        const dist2 = dx * dx + dy * dy;

        if (dist2 <= BALL_RADIUS * BALL_RADIUS) {
            let nx = 0;
            let ny = 0;
            const dist = Math.sqrt(dist2);
            if (dist > 1e-6) {
                nx = dx / dist;
                ny = dy / dist;
            } else {
                // ball center is inside pad rect or extremely close: fallback to previous position
                // determine penetration axis using previous position vs pad
                const wasLeft = prevX + BALL_RADIUS <= padLeft;
                const wasRight = prevX - BALL_RADIUS >= padRight;
                const wasAbove = prevY + BALL_RADIUS <= padTop;
                const wasBelow = prevY - BALL_RADIUS >= padBottom;

                if (wasLeft) { nx = -1; ny = 0; }
                else if (wasRight) { nx = 1; ny = 0; }
                else if (wasAbove) { nx = 0; ny = -1; }
                else if (wasBelow) { nx = 0; ny = 1; }
                else {
                    // As a last resort, pick horizontal normal based on ball.x vs pad center
                    nx = ball.x < (padLeft + padRight) / 2 ? -1 : 1;
                    ny = 0;
                }
            }

            // move ball out of penetration along normal
            const penetration = BALL_RADIUS - Math.sqrt(dist2);
            ball.x += nx * penetration;
            ball.y += ny * penetration;

            // reflect velocity v' = v - 2*(v·n)*n
            const vdotn = ball.vx * nx + ball.vy * ny;
            ball.vx = ball.vx - 2 * vdotn * nx;
            ball.vy = ball.vy - 2 * vdotn * ny;

            // slightly increase speed for gameplay and clamp
            let speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            speed = Math.min(BALL_MAX_SPEED, Math.max(1, speed * 1.03));
            const newVx = (ball.vx / Math.max(1e-6, Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy))) * speed;
            const newVy = (ball.vy / Math.max(1e-6, Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy))) * speed;
            ball.vx = newVx;
            ball.vy = newVy;

            return false;
        }
    }

    return false;
}
