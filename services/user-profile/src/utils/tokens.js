export async function saveToken(db, username, token, expires_at) {
	const tmp = await db.get("SELECT token FROM tokens WHERE username = ?", [username]);
	if (tmp) await deleteToken(db, tmp.token);
	await db.run(
		"INSERT INTO tokens (username, token, expires_at) VALUES (?, ?, datetime('now', ?, '+2 hour'))",
		[username, token, expires_at]
	);
}

export async function deleteToken(db, token) {
	await db.run("DELETE FROM tokens WHERE token = ?", [token]);
}

export async function updateToken(db, token) {
	await db.run("UPDATE token FROM tokens WHERE token = ?", [token]);
}