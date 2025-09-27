import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import config from "./config.js";
import dbPlugin from "./plugins/db.js";
import jwtPlugin from "./plugins/jwt.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { deleteToken, saveToken } from "./utils/tokens.js";

const fastify = Fastify({ logger: true });

async function start() {
	await fastify.register(cors, {
		origin: ["http://localhost:5173", "https://localhost:8443"],
		methods: ["POST", "GET", "DELETE", "OPTION"],
		credentials: true,
	}
	);
	await fastify.register(swagger, {
		openapi: {
			info: { title: "Users API", version: "1.0.0" },
			servers: [{ url: `http://localhost:${config.port}` }],
		},
	});
	await fastify.register(swaggerUi, {
		routePrefix: "/docs",
		uiConfig: { docExpansion: "list", deepLinking: false },
	});

	await fastify.register(dbPlugin);
	await fastify.register(jwtPlugin);

	await fastify.register(authRoutes);
	await fastify.register(userRoutes);

	try {
		await fastify.listen({ port: config.port, host: "0.0.0.0" });
		console.log(`🚀 Server running at http://localhost:${config.port}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

start();