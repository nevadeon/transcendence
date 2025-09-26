import db from auth.js;
import jwt from "@fastify/jwt";

const secret = process.env.JWT_SECRET;

await db.exec(`
	CREATE TABLE IF NOT EXISTS tokens (
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"userNnme" INTEGER NOT NULL,
		"token" TEXT NOT NULL UNIQUE,
		"created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
		"expires_at" DATETIME,
		FOREIGN KEY(user_id) REFERENCES users(name)
	)
`);

export function GenerateToken(user) {
	return jwt.sign({id: user.id, name: user.name}, secret, { expiresin: "1h" });
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, secret);
	} catch (err) {
		return null;
	}
}

export async function saveToken(username, token) {
	await db.run ("INSERT INTO tokens (username, token, expire_at) VALUES (?, ?, datetime('now', '+1hour'))", [1, token]);
}

export async function deleteToken(token) {
	await db.run("DELETE INTO tokens WHERE token = ?", [token]);
}