import fp from "fastify-plugin";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { getVaultSecret } from "./vault.js"
// import config from "../config.js";

const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30min

async function dbPlugin(fastify) {
	const DB_PATH = await getVaultSecret("game/config", "GAME_DB_PATH");

	const db = await open ({
		filename: DB_PATH,
		driver: sqlite3.Database,
	});

	await db.exec(`
		DROP TABLE IF EXISTS users_stats;
		DROP TABLE IF EXISTS match_history;
		DROP TABLE IF EXISTS game_sessions;
		DROP TABLE IF EXISTS tournament_config;
	`);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS users_stats (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			games INTEGER DEFAULT 0,
			wins INTEGER DEFAULT 0,
			losses INTEGER DEFAULT 0,
			INTEGER DEFAULT 0,
			versus_wins INTEGER DEFAULT 0,
			versus_losses INTEGER DEFAULT 0,
			versusCoop INTEGER DEFAULT 0,
			versusCoop_wins INTEGER DEFAULT 0,
			versusCoop_losses INTEGER DEFAULT 0,
			versusIa INTEGER DEFAULT 0,
			versusIa_wins INTEGER DEFAULT 0,
			versusIa_losses INTEGER DEFAULT 0,
			tournament INTEGER DEFAULT 0,
			tournament_wins INTEGER DEFAULT 0,
			tournament_losses INTEGER DEFAULT 0,
			billard INTEGER DEFAULT 0,
			billard_wins INTEGER DEFAULT 0
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

	await db.exec(`
        CREATE TABLE IF NOT EXISTS game_sessions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			mode TEXT NOT NULL,
			status TEXT NOT NULL,
			user_host_id INTEGER NOT NULL,
			players_json TEXT NOT NULL,
			state_json TEXT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tournament_config (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			host_user_id INTEGER NOT NULL,
			players_json TEXT NOT NULL,
			matches_json TEXT NOT NULL,
			current_match_id INTEGER NULL,
			status TEXT NOT NULL,
			winner_name TEXT NULL
        )
    `);

	fastify.decorate("db", db);

    startGarbageCollector(db);
}

function startGarbageCollector(db) {
    const runCleanup = async () => {
        try {
            console.log("Démarrage du nettoyage des sessions de jeu obsolètes...");
            const result = await db.run(`
                DELETE FROM game_sessions WHERE
                    status != 'completed'
                    AND created_at < DATETIME('now', '-1 hour');
            `);
            console.log(`Nettoyage terminé. ${result.changes} sessions obsolètes supprimées.`);
        } catch (error) {
            console.error("Erreur lors de l'exécution du Garbage Collector pour game_sessions:", error);
        }
    };
    // exec direct apres run de la db
    setTimeout(runCleanup, 5000);
    setInterval(runCleanup, CLEANUP_INTERVAL_MS);
}

export default fp(dbPlugin);