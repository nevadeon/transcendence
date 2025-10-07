import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { Server } from 'socket.io';

import {getVaultSecret} from "./plugins/vault.js";
import dbPlugins from "./plugins/db.js";
import gameRoutes from "./routes/game.js";

const fastify = Fastify({ logger: true });

async function start() {
	await fastify.register(cors, {
		origin: ["http://localhost:5173", "https://localhost:8443"],
		methods: ["POST", "GET", "DELETE", "OPTION"],
		credentials: true,
	});

	const GAME_PORT = await getVaultSecret("game/config", "GAME_PORT");

	await fastify.register(swagger, {
		openapi: {
			info: {title: "Games API", version: "1.0.0"},
			servers: [{ url: `http://localhost:${GAME_PORT}` }],
		},
	});
	await fastify.register(swaggerUi, {
		routePrefix: "/docs/game",
		uiConfig: { docExpansion: "list", deepLinking: false },
	});

	await fastify.register(dbPlugins);
	await fastify.register(gameRoutes);

	//plugin -> register
	const io = new Server(fastify.server, {
        cors: {
            origin: ["http://localhost:5173", "https://localhost:8443"],
            methods: ["GET", "POST"]
        }
    });

	fastify.decorate('io', io);
	setupSocketLogic(io, fastify); //after

	try {
		await fastify.listen({ port: GAME_PORT, host: "0.0.0.0"});
		fastify.log.info(`Server running at http://localhost:${GAME_PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

}

start();