import fp from "fastify-plugin";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { getVaultSecret } from "./vault.js"

const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30min

async function dbPlugin(fastify) {
	const DB_PATH = await getVaultSecret("game/config", "GAME_DB_PATH");

	const db = await open ({
		filename: DB_PATH,
		driver: sqlite3.Database,
	});

	await db.exec(`
		CREATE TABLE IF NOT EXISTS users_stats (
			id INTEGER NOT NULL PRIMARY KEY UNIQUE,
			games INTEGER DEFAULT 0,
			wins INTEGER DEFAULT 0,
			losses INTEGER DEFAULT 0,
			versus INTEGER DEFAULT 0,
			versus_wins INTEGER DEFAULT 0,
			versus_losses INTEGER DEFAULT 0,
			versusIa INTEGER DEFAULT 0,
			versusIa_wins INTEGER DEFAULT 0,
			versusIa_losses INTEGER DEFAULT 0,
			tournament INTEGER DEFAULT 0,
			tournament_wins INTEGER DEFAULT 0,
			tournament_losses INTEGER DEFAULT 0,
			billiard INTEGER DEFAULT 0,
			billard_wins INTEGER DEFAULT 0,
			billard_losses INTEGER DEFAULT 0
		)
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS match_history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			left_team_A TEXT NOT NULL,
			avatar_left_team_A TEXT NOT NULL,
			left_team_B TEXT,
			avatar_left_team_B TEXT,
			right_team_A TEXT NOT NULL,
			avatar_right_team_A TEXT NOT NULL,
			right_team_B TEXT,
			avatar_right_team_B TEXT,
			mode TEXT NOT NULL,
			left_team_score INTEGER NOT NULL,
			right_team_score INTEGER NOT NULL,
			winnerId INTEGER NOT NULL DEFAULT 1 CHECK (winnerId IN (1, 2)),
			date DATE DEFAULT (DATE('now'))
		)
	`)

	fastify.decorate("db", db);
}

export default fp(dbPlugin);