import fp from "fastify-plugin";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import config from "../config.js";
import { getVaultSecret } from "./vault.js";

async function dbPlugin(fastify) {

	const DB_PATH = await getVaultSecret("user-profile/config", "USER_PROFILE_DB_PATH");

	const db = await open({
		filename: DB_PATH,
		driver: sqlite3.Database,
	});

	//auto suppr au 'make re'
	await db.exec(`
		DROP TABLE IF EXISTS users;
		DROP TABLE IF EXISTS tokens;
        DROP TABLE IF EXISTS friends;
	`);

	// Création tables
	await db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			email TEXT NOT NULL UNIQUE,
			password TEXT,
			species TEXT DEFAULT 'Human',
			planet TEXT DEFAULT 'Earth',
			dimension TEXT DEFAULT 'C-137',
			avatar TEXT DEFAULT 'defaults/poopy.png',
			status INTEGER NOT NULL DEFAULT 0 CHECK (status IN (0, 1)),
			two_factor_secret TEXT NULL,
			two_factor INTEGER NOT NULL DEFAULT 0 CHECK (two_factor IN (0, 1)),
			googleId TEXT UNIQUE
		)
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS tokens (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			token TEXT NOT NULL UNIQUE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			expires_at DATETIME,
			FOREIGN KEY(username) REFERENCES users(name) ON DELETE CASCADE
		)
	`);

	await db.exec(`
        CREATE TABLE IF NOT EXISTS friends (
            user_id INTEGER NOT NULL,
            friend_id INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2)),
            PRIMARY KEY (user_id, friend_id),
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(friend_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

	fastify.decorate("db", db);
}

export default fp(dbPlugin);
