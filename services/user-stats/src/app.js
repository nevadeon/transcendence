import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";


import {getVaultSecret} from "./plugins/vault.js";
import dbPlugins from "./plugins/db.js";
import statsRoutes from "./routes/stats.js";

const fastify = Fastify({ logger: true });

async function start() {
	await fastify.register(cors, {
		origin: ["http://localhost:5173", "https://localhost:8443"],
		methods: ["POST", "GET", "DELETE", "OPTION"],
		credentials: true,
	});

	const USER_STATS_PORT = await getVaultSecret("user-stats/config", "USER_STATS_PORT");

	await fastify.register(swagger, {
		openapi: {
			info: {title: "Users profile API", version: "1.0.0"},
			servers: [{ url: `http://localhost:${USER_STATS_PORT}` }],
		},
	});
	await fastify.register(swaggerUi, {
		routePrefix: "/docs/user-stats",
		uiConfig: { docExpansion: "list", deepLinking: false },
	});

	await fastify.register(dbPlugins);
	await fastify.register(statsRoutes);

	try {
		await fastify.listen({ port: USER_STATS_PORT, host: "0.0.0.0"});
		fastify.log.info('Server running at http://localhost:${USER_STATS_PORT}');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

}

start();