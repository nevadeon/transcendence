import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import config from "./config.js";
import dbPlugin from "./plugins/db.js";
import jwtPlugin from "./plugins/jwt.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

const fastify = Fastify({ logger: true });

async function start() {
	await fastify.register(cors, { origin: ["http://localhost:5173"] });
	await fastify.register(swagger, {
		openapi: {
			info: { title: "Users API", version: "1.0.0" },
			servers: [{ url: `http://localhost:${config.port}` }],
		},
	});
	await fastify.register(swaggerUi, { routePrefix: "/docs" });

	await fastify.register(dbPlugin);
	await fastify.register(jwtPlugin);

	await fastify.register(authRoutes);
	await fastify.register(userRoutes);

	await fastify.listen({ port: config.port, host: "0.0.0.0" });
	console.log(`🚀 Server running at http://localhost:${config.port}`);
}

start();
