import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import argon2 from "argon2";


async function startServer() {

	const fastify = Fastify({logger: true});

	// open the db 
	const dbPath = process.env.DB_PATH || "./data/users.db";
	const db = await open({ filename: dbPath, driver: sqlite3.Database });

	// Create users table
	await db.exec(`
		CREATE TABLE IF NOT EXISTS "users" (
			"id" INTEGER PRIMARY KEY AUTOINCREMENT,
			"name" TEXT NOT NULL UNIQUE,
			"email" TEXT NOT NULL UNIQUE,
			"password" TEXT NOT NULL,
			"species" TEXT DEFAULT 'Human',
			"planet" TEXT DEFAULT 'Earth',
			"dimension" TEXT DEFAULT 'C-137'
		)
	`);
	
	const user = await db.get(
		"SELECT * FROM users WHERE name = ?",
		["Rick"]
	);

	if (!user) {
		console.log("Aucun utilisateur trouvé");
	} else {
		console.log("Utilisateur :", user);
	}
/* ========================= Plugins ========================= */
	await fastify.register(cors, {
		origin: ["https://localhost:8443", "http://localhost:5173"], // autorise toutes les origines
	});

		// 🔹 Swagger config
	await fastify.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Users API",
				description: "API pour gérer les utilisateurs (Fastify + SQLite)",
				version: "1.0.0"
			},
			servers: [{ url: "http://localhost:3001" }]}});

	// 🔹 Swagger UI
	await fastify.register(fastifySwaggerUi, {
		routePrefix: "/docs",
		uiConfig: { docExpansion: "list", deepLinking: false}});

	// JWT
	await fastify.register(jwt, {
		secret: process.env.JWT_SECRET || "super-secret-key" });


/* ========================= Roads ========================= */
	// Register
	fastify.post("/register", {
		schema: {
			description: "register user in the db",
			tags: ["Auth"],
			body: {
				type: "object",
				required: ["name", "email", "password"],
				properties: {
					name: { type: "string" },
					email: { type: "string", format: "email" },
					password: { type: "string" , minLength: 8},
				}
			},
			response: {
				201: {
					type: "object",
					properties: {
						id: { type: "integer" },
						name: { type: "string" },
						species: { type: "string" },
						planet: { type: "string" },
						dimension: { type: "string" },
					}
				}
			}
		}
	}, async (request, reply) => {
		const { name: name, email, password } = request.body;
		try {
			const hashedpassword = await argon2.hash(password);
			const result = await db.run(
				"INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
				[name, email, hashedpassword]
			);
			return reply.code(201).send({ id: result.lastID, name: name, email });
		} catch(err) {
			return reply.code(500).send({error: err.message});
		}
	});

	// Login
	fastify.post("/login", {
		schema: {
			description: "user connection and generate JWT",
			tags: ["Auth"],
			body: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 8}
				}
			},
			response: {
				200: {
					type: "object",
					properties: {
						token: { type: "string" }
					}
				},
				401: {
					type: "object",
					properties: {
						error: { type: "string" }
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
			const { email, password } = request.body;

			const user = await db.get("SELECT * FROM users WHERE name = ?", [name]);
			if (!user) return reply.code(401).send({ error: "Invalid name or password" });

			const isValid = await argon2.verify(password, user.password);
			if (!isValid) return reply.code(401).send({ error: "Invalid name or password" });

			const token = fastify.jwt.sign({ id: user.id, name: user.name });
			return reply.code(200).send({ token: token });
		} catch (err) {
			return reply.code(500).send({ error: err.message });
		}
	});

	// Read all
	fastify.get("/users", {
		schema: {
			description: "Take the entire list of user",
			tags: ["Users"],
			response: {
				200: {
					description: "Users' list",
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
		const { nickname, email } = request.body;
		try {
			const result = await db.run(
				"UPDATE users SET nickname=?, email=? WHERE id=?",
				[nickname, email, id]
			);
			if (result.changes === 0)
				return reply.code(404).send({ error: "User not found" });
			return { id, nickname, email };
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
	try {
		await fastify.listen({ port: 3001, host: '0.0.0.0' });
		console.log('Serveur Fastify lancé sur http://localhost:3001');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

startServer();