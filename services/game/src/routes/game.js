// gameRoutes.js
async function gameRoutes(fastify) {
    const { db } = fastify;

    // 1. ROUTE DE DIAGNOSTIC DE SANTÉ
    fastify.get("/health", async (req, reply) => {
        try {
            await db.get("SELECT 1"); 
            reply.code(200).send({ 
                status: "ok", 
                message: "Game service is running and DB is connected."
            });
        } catch (err) {
            fastify.log.error(err);
            reply.code(503).send({ 
                status: "error", 
                message: "DB connection failed."
            });
        }
    });

    // 2. ROUTE DE VÉRIFICATION DES SESSIONS ACTIVES
    fastify.get("/sessions", async (req, reply) => {
        try {
            const sessions = await db.all(`
                SELECT id, mode, status, user_host_id, created_at 
                FROM game_sessions 
                WHERE status != 'completed'
            `);
            reply.code(200).send({ 
                count: sessions.length,
                active_sessions: sessions 
            });
        } catch (err) {
            fastify.log.error(err);
            reply.code(500).send({ error: "Failed to retrieve game sessions."})
        }
    });

    // Ancien placeholder (maintenant à supprimer ou remplacer par une logique réelle)
    fastify.get("/game_history", async (req, reply) => {
        reply.code(200).send({ message: "Game history endpoint - functionality not yet implemented here." });
    });
}

export default gameRoutes;