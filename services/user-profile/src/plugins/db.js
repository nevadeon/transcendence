import fp from "fastify-plugin";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import config from "../config.js";

async function dbPlugin(fastify) {
	const db = await open({
		filename: config.dbPath,
		driver: sqlite3.Database,
	});

	// Création tables
	await db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			email TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			species TEXT DEFAULT 'Human',
			planet TEXT DEFAULT 'Earth',
			dimension TEXT DEFAULT 'C-137',
			avatar TEXT DEFAULT 'defaults/poopy.png'
		)
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS tokens (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			token TEXT NOT NULL UNIQUE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			expires_at DATETIME,
			FOREIGN KEY(username) REFERENCES users(name)
		)
	`);

	fastify.decorate("db", db);
}

export default fp(dbPlugin);
