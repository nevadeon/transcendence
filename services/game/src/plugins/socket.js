import fp from "fastify-plugin";
import { Server } from 'socket.io';
import { setupSocketLogic } from "../logic/socket-game-logic.js";

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

    setupSocketLogic(io, fastify);
}

export default fp(socketPlugin);