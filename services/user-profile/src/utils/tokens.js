export async function saveToken(db, username, token) {
	const tmp = await db.get("SELECT token FROM tokens WHERE username = ?", [username]);
	if (tmp) await deleteToken(db, tmp.token);
	await db.run(
		"INSERT INTO tokens (username, token, expires_at) VALUES (?, ?, datetime('now', '+1 hour'))",
		[username, token]
	);
}

export async function deleteToken(db, token) {
	await db.run("DELETE FROM tokens WHERE token = ?", [token]);
}
