import fp from "fastify-plugin";
import { Server } from 'socket.io';

async function socketPlugin(fastify) {
    if (!fastify.server) {
        throw new Error("Fastify server instance is not available.");
    }

    const io = new Server(fastify.server, {
        cors: {
            origin: ["http://localhost:5173", "https://localhost:8443"],
            methods: ["GET", "POST"]
        }
    });

    fastify.decorate('io', io);

    // 3. Ici, vous pouvez appeler la logique pour gérer les connexions
    // C'est le meilleur endroit pour centraliser setupSocketLogic(io, fastify);
    // const { setupSocketLogic } = require('../logic/socket-game-logic'); // Créez ce fichier
    // setupSocketLogic(io, fastify);
}

export default fp(socketPlugin);