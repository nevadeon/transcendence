import sqlite3 from "sqlite3";
import { open } from "sqlite"; // wrapper pour promisify

const dbPath = process.env.DB_PATH || "./user-profile.sqlite";

// Ouvre la DB (créée si elle n’existe pas)
const db = await open({
	filename: dbPath,
	driver: sqlite3.Database
});

// Création de la table users si elle n’existe pas
await db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT UNIQUE
	)
`);
