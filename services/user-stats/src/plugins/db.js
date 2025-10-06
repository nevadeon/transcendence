import fp from "fastify-plugin";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import config from "../config.js";
import { getVaultSecret } from "./vault.js"

async function dbPlugin(fastify) {
	const DB_PATH = await getVaultSecret("user-stats/config", "USER_STATS_DB_PATH");

	const db = await open ({
		filename: DB_PATH,
		driver: sqlite3.Database,
	});

	await db.exec(`
		DROP TABLE IF EXISTS users_stats;	
		DROP TABLE IF EXISTS match_history;	
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS users_stats (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			games INTEGER DEFAULT 0,
			wins INTEGER DEFAULT 0,
			tournaments INTEGER DEFAULT 0,
			tournaments_win INTEGER DEFAULT 0,
			versus INTEGER DEFAULT 0,
			versus_win INTEGER DEFAULT 0,
			versusCoop INTEGER DEFAULT 0,
			versusCoop_win INTEGER DEFAULT 0,
			versusIa INTEGER DEFAULT 0,
			versusIa_win INTEGER DEFAULT 0,
			billiards INTEGER DEFAULT 0,
			billiards_win INTEGER DEFAULT 0
		)
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS match_history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			red_team_A TEXT NOT NULL,
			red_team_B TEXT,
			blue_team_A TEXT DEFAULT 'IA',
			blue_team_B TEXT,
			mode TEXT NOT NULL,
			red_team_score INTEGER NOT NULL,
			blue_team_score INTEGER NOT NULL,
			winner TEXT NOT NULL,
			date DATE DEFAULT (DATE('now'))
		)
	`)

	fastify.decorate("db", db);
}

export default fp(dbPlugin);