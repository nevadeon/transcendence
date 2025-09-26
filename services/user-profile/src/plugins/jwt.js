import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import config from "../config.js";

async function jwtPlugin(fastify) {
	await fastify.register(jwt, {
		secret: config.jwtSecret,
	});

	fastify.decorate("auth", {
		generateToken: (user) =>
			fastify.jwt.sign({ id: user.id, name: user.name }, { expiresIn: "1h" }),
		verifyToken: (token) => {
			try {
				return fastify.jwt.verify(token);
			} catch {
				return null;
			}
		},
	});
}

export default fp(jwtPlugin);
