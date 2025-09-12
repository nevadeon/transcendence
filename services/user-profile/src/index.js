import sqlite3 from "sqlite3";
import { open } from "sqlite"; // wrapper pour promisify
import express from "express";

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

const app = express();
app.use(express.json());

// Create
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await db.run("INSERT INTO users(name, email) VALUES(?, ?)", [name, email]);
    res.status(201).json({ id: result.lastID, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all
app.get("/users", async (req, res) => {
  try {
    const users = await db.all("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read by ID
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await db.run("UPDATE users SET name=?, email=? WHERE id=?", [name, email, id]);
    if (result.changes === 0) return res.status(404).json({ error: "User not found" });
    res.json({ id, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.run("DELETE FROM users WHERE id=?", [id]);
    if (result.changes === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Users service running on port ${PORT}`));
