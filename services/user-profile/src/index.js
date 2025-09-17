import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import argon2 from "argon2";
import cors from "@fastify/cors";

const fastify = Fastify({logger: true});

// 🔹 Swagger config
await fastify.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Users API",
			description: "API pour gérer les utilisateurs (Fastify + SQLite)",
			version: "1.0.0"
		},
		servers: [
			{ url: "http://localhost:3001" }
		]
	}
});

// 🔹 Swagger UI
await fastify.register(fastifySwaggerUi, {
	routePrefix: "/docs", // URL => http://localhost:3001/docs
	uiConfig: {
		docExpansion: "list",
		deepLinking: false
	}
});

await fastify.register(cors, {
    origin: 'http://localhost:5173', // frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // all methods allowed
    allowedHeaders: ['Content-Type', 'Authorization'],
});

const dbPath = process.env.DB_PATH || "./user-profile.sqlite";

// open the db 
const db = await open({
	filename: dbPath,
	driver: sqlite3.Database
});

// Create users table
// status need websocket !!!
await db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT UNIQUE,
		password TEXT NOT NULL,
		species TEXT DEFAULT 'Human',
		planet TEXT DEFAULT 'Earth',
		dimension TEXT DEFAULT 'C-137'
	)
`);

// Parse JSON

//New user from /register
fastify.post("/register", {
	schema: {
		body: {
			type: "object",
			required: ["name", "email"],
			properties: {
				name: { type: "string" },
				email: { type: "string", format: "email" }
			}
		},
		response: {
			201: {
				type: "object",
				properties: {
					id: { type: "integer" },
					name: { type: "string" },
					email: { type: "string" }
				}
			}
		}
	}
}, async (request, reply) => {
	const { name, email } = request.body;
	const result = await db.run(
		"INSERT INTO users(name, email) VALUES(?, ?)",
		[name, email]
	);
	return reply.code(201).send({ id: result.lastID, name, email }); //response 201
});

// Read all
fastify.get("/users", {
	schema: {
		description: "Take the entire list of user",
		tags: ["Users"],
		response: {
			200: {
				description: "User's list",
				type: "array",
				items: {
					type: "object",
					properties: {
						id: { type: "integer" },
						name: { type: "string" },
						email: { type: "string" }
					}
				}
			},
			500: {
				description: "Server Error.",
				type: "object",
				properties: {
					error: { type: "string" }
				}
			}
		}
	}
}, async (request, reply) => {
	try {
		const users = await db.all("SELECT * FROM users");
		return users;
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
});

// Read by ID
fastify.get("/users/:id",{
	schema: {
		description: "Get one user by id",
		tags: ["Users"],
		response: {
			200: {
				description: "User",
				type: "array",
				items: {
					type: "object",
					properties: {
						id: { type: "integer" },
						name: { type: "string" },
						email: { type: "string" }
					}
				}
			},
			404: {
				description: "User not found",
				type: "object",
				properties: {
					error: {type: "string"}
				}
			},
			500: {
				description: "Server Error.",
				type: "object",
				properties: {
					error: { type: "string" }
				}
			}
		}
	}
}, async (request, reply) => {
	const { id } = request.params;
	try {
		const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
		if (!user) return reply.code(404).send({ error: "User not found" });
		return user;
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
});

// Update
fastify.put("/users/:id",{
	schema: {
		description: "Update one user by id",
		tags: ["Users"],
		response: {
			200: {
				description: "User",
				type: "array",
				items: {
					type: "object",
					properties: {
						id: { type: "integer" },
						name: { type: "string" },
						email: { type: "string" }
					}
				}
			},
			404: {
				description: "User not found",
				type: "object",
				properties: {
					error: {type: "string"}
				}
			},
			500: {
				description: "Server Error",
				type: "object",
				properties: {
					error: { type: "string" }
				}
			}
		}
	}
}, async (request, reply) => {
	const { id } = request.params;
	const { name, email } = request.body;
	try {
		const result = await db.run(
			"UPDATE users SET username=?, email=? WHERE id=?",
			[name, email, id]
		);
		if (result.changes === 0)
			return reply.code(404).send({ error: "User not found" });
		return { id, name, email };
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
});

// Delete
fastify.delete("/users/:id",{
	schema: {
		description: "Delete one user by id",
		tags: ["Users"],
		response: {
			200: {
				description: "User",
				type: "object",
				properties: {
					message: { type: "string" }
				}
			},
			404: {
				description: "User not found",
				type: "object",
				properties: {
					error: {type: "string"}
				}
			},
			500: {
				description: "Server Error.",
				type: "object",
				properties: {
					error: { type: "string" }
				}
			}
		}
	}
}, async (request, reply) => {
	const { id } = request.params;
	try {
		const result = await db.run("DELETE FROM users WHERE id=?", [id]);
		if (result.changes === 0)
			return reply.code(404).send({ error: "User not found" });
		return { message: "Deleted successfully" };
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
});

// Start server
const PORT = process.env.PORT || 3001;

try {
	fastify.listen({ port: PORT, host: "0.0.0.0" });
	console.log(`Users service running on port ${PORT}`);
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
