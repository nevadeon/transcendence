import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import config from "../config.js";
import { getVaultSecret } from "./vault.js";

async function jwtPlugin(fastify) {

	const JWT_SECRET = await getVaultSecret("user-profile/config", "JWT_SECRET");

	await fastify.register(jwt, {
		secret: JWT_SECRET,
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
