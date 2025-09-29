import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import config from "./config.js"
import dbPlugin from "./plugins/db.js";
import jwtPlugin from "./plugins/jwt.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

const fastify = Fastify({ logger: true });

async function start() {
	await fastify.register(cors, {
		origin: ["http://localhost:5173", "https://localhost:8443"],
		methods: ["POST", "GET", "DELETE", "OPTION"],
		credentials: true,
	}
	);

	const res = await fetch(`${config.VAULT_ADDR}/v1/secret/data/user-profile/JWT_SECRET`, {
		headers: { "X-Vault-Token": config.VAULT_TOKEN }
	});
	const body = await res.json();
	const USER_PROFILE_PORT = body?.data?.data?.USER_PROFILE_PORT || 3001;

	await fastify.register(swagger, {
		openapi: {
			info: { title: "Users API", version: "1.0.0" },
			servers: [{ url: `http://localhost:${USER_PROFILE_PORT}` }],
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
		await fastify.listen({ port: USER_PROFILE_PORT, host: "0.0.0.0" });
		console.log(`🚀 Server running at http://localhost:${USER_PROFILE_PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

start();