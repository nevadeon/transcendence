import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import dbPlugin from "./plugins/db.js";
import jwtPlugin from "./plugins/jwt.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import {getVaultSecret} from "./plugins/vault.js";

const fastify = Fastify({ logger: true });

async function start() {
	await fastify.register(cors, {
		origin: ["http://localhost:5173", "https://localhost:8443"],
		methods: ["POST", "GET", "DELETE", "OPTION", "PUT", "PATCH"],
		credentials: true,
	});

	const USER_PROFILE_PORT = await getVaultSecret("USER_PROFILE_PORT");

	await fastify.register(swagger, {
		openapi: {
			info: { title: "Users profile API", version: "1.0.0" },
			servers: [{ url: `http://localhost:${USER_PROFILE_PORT}` }],
		},
	});
	await fastify.register(swaggerUi, {
		routePrefix: "/docs/user-profile",
		uiConfig: { docExpansion: "list", deepLinking: false },
	});

	await fastify.register(dbPlugin);
	await fastify.register(jwtPlugin);

	await fastify.register(authRoutes);
	await fastify.register(userRoutes);

	try {
		await fastify.listen({ port: USER_PROFILE_PORT, host: "0.0.0.0" });
		fastify.log.info(`Server running at http://localhost:${USER_PROFILE_PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

start();