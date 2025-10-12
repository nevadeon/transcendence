import argon2 from "argon2";
import crypto from 'crypto';
import { getVaultSecret } from "../plugins/vault.js";
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

// 2fa config
const APP_NAME = "ft_transcendence";
authenticator.options = { window: 1 };

const authenticate = async (req, reply) => {
		try {
			const payload = await req.jwtVerify();
			if (!payload.id) {
				throw new Error("Token payload missing required user ID.");
			}
			req.user = payload;
		} catch (err) {
			console.log({error: 'JWT Verification Failed:', err});
			reply.code(401).send({ message: "Authentification requise. Token JWT invalide ou manquant." });
			throw err; // to trigger catch(err) within calling routes
		}
	};

async function userRoutes(fastify) {
	const { db } = fastify;

	fastify.get("/users", async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			return ;
		}
		const userId = req.user.id;
		try {
			const users = await db.all("SELECT id, name, avatar, status, species, planet, dimension FROM users WHERE id!=?", [userId]);
			return reply.code(200).send(users);
		} catch (err) {
			return reply.status(500).send({ message: "Erreur lors de la récupération des utilisateurs." });
		}
	});

	fastify.get("/users/to-request", async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			return ;
		}
		const userId = req.user.id;
		try {
			const users = await db.all(
				`SELECT u.id, u.name, u.avatar, u.status, u.species, u.planet, u.dimension
				FROM users u
				WHERE u.id != ?
					AND NOT EXISTS (
						SELECT 1
						FROM friend_requests f
						WHERE (f.user_id = ? AND f.friend_id = u.id)
								OR (f.user_id = u.id AND f.friend_id = ?)
					)
					AND NOT EXISTS (
						SELECT 1
						FROM accepted_friends af
						WHERE ((af.user_id = ? AND af.friend_id = u.id)
							OR (af.user_id = u.id AND af.friend_id = ?))
						)`,
				[userId, userId, userId, userId, userId]
			);
			return reply.code(200).send(users);
		} catch (err) {
			return reply.status(500).send({ message: "Erreur lors de la récupération des utilisateurs." });
		}
	});

	fastify.get("/users/:id/", async (req, reply) => {
		const user = await db.get("SELECT * FROM users WHERE id=?", [req.params.id]);
		if (!user)
			return reply.code(404).send({ error: "USER NOT FOUND" });
		return reply.code(201).send({user: user});
	});

	fastify.put("/users/:id/avatar", async (req, reply) => {
		const { avatar: rawAvatar } = req.body;
		const avatar = rawAvatar.trim();
		try {
			await db.run(
				"UPDATE users SET avatar=? WHERE id=?",
				[avatar, req.params.id]
			);
			return reply.code(200).send({ avatar: avatar });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.put("/users/:id/name", async (req, reply) => {
		const { name: rawName } = req.body;
		const name = rawName.trim();
		try {
			const currUser = await db.get("SELECT name FROM users WHERE id=?", [req.params.id]);
			if (currUser.name.trim() === name)
				return reply.code(409).send({ error: "USERNAME ALREADY EXISTS" });
			await db.run(
				"UPDATE users SET name=? WHERE id=?",
				[name, req.params.id]
			);
			return reply.code(200).send({ name: name });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.put("/users/:id/email", async (req, reply) => {
		const { email: rawEmail } = req.body;
		const email = rawEmail.trim();
		const SECRET_SALT = await getVaultSecret("SECRET_SALT");
		const newHashedEmail = crypto.createHash('sha256').update(email + SECRET_SALT).digest('hex');
		try {
			const currHashedEmail = await db.get("SELECT email FROM users WHERE id=?", [req.params.id]);
			if (currHashedEmail.email.trim() === newHashedEmail)
				return reply.code(409).send({ error: "EMAIL ALREADY EXISTS" });
			await db.run(
				"UPDATE users SET email=? WHERE id=?",
				[newHashedEmail, req.params.id]
			);
			return reply.code(200).send({ email: email });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.put("/users/:id/password", async (req, reply) => {
		const { password } = req.body;
		try {
			const user = await db.get( "SELECT password FROM users WHERE id=?", [req.params.id] );
			const samePassword = await argon2.verify(user.password, password);
			if (samePassword)
				return reply.code(409).send({ error: "PASSWORD DO NOT CHANGE" });
			const hashed_password = await argon2.hash(password);
			await db.run(
				"UPDATE users SET password=? WHERE id=?",
				[hashed_password, req.params.id]
			);
			return reply.code(200).send({ msg: "PASSWORD UPDATED"});
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: err.message });
		}
	});

	fastify.get('/api/user/2fa/status', async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			return;
		}
		const userId = req.user.id;
		try {
			const user = await db.get(
				"SELECT two_factor, two_factor_secret FROM users WHERE id=?", 
				[userId]
			);
			if (!user) {
				return reply.code(404).send({ message: "User is not found." });
			}
			return reply.code(200).send({
				is_2fa_enabled: user.two_factor === 1,
				has_secret: !!user.two_factor_secret
			});
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: "An error occurred while retrieving 2FA status." });
		}
	});

	fastify.post('/api/user/2fa/generate-secret', async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			return;
		}
		const userId = req.user.id;
		try {
			const user = await db.get("SELECT email FROM users WHERE id=?", [userId]);
			if (!user || !user.email)
				 return reply.code(404).send({ message: "User is not found or email is missing." });
			const secret = authenticator.generateSecret();
			const otpAuthUrl = authenticator.keyuri(
				user.email,
				APP_NAME,
				secret
			);
			// uri to url
			const qrCodeImage = await qrcode.toDataURL(otpAuthUrl);
			await db.run(
				"UPDATE users SET two_factor_secret=? WHERE id=?",
				[secret, userId]
			);
			return reply.code(200).send({
				qrCodeImage: qrCodeImage,
				identifier: user.email //email visible dans Google Authenticator
			});
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: "An error occurred while generating 2FA." });
		}
	});

	fastify.post('/api/user/2fa/verify-setup', async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			return;
		}
		const userId = req.user.id;
		const { token } = req.body; // Le code TOTP à 6 chiffres soumis par l'utilisateur
		if (!token || typeof token !== 'string' || token.length !== 6 || isNaN(parseInt(token, 10))) {
			return reply.code(400).send({ message: "Token TOTP invalide." });
		}
		try {
			const userCheck = await db.get("SELECT two_factor_secret FROM users WHERE id=?", [userId]);
			if (!userCheck || !userCheck.two_factor_secret) {
				return reply.code(400).send({
					message: "2FA secret not found. Please generate the QR Code first."
				});
			}
			const secret = userCheck.two_factor_secret;
			const isValid = authenticator.verify({ token, secret });
			if (!isValid) {
				return reply.code(401).send({ message: "2FA code is incorect or expired." });
			}

			await db.run(
				"UPDATE users SET two_factor=? WHERE id=?",
				[1, userId]
			);
			return reply.code(200).send({ message: "2FA is activate and confirmed with success !", is_2fa_enabled: 1 });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ message: "An error occured while verifying 2FA." });
		}
	});

	fastify.put("/api/user/2fa/toggle", async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			return;
		}
		const userId = req.user.id;
		const new2FAState = req.body.two_factor ? 1 : 0;
		try {
			if (new2FAState === 1) {
				const userCheck = await db.get("SELECT two_factor_secret FROM users WHERE id=?", [userId]);
				if (!userCheck || !userCheck.two_factor_secret) {
					return reply.code(400).send({
						message: "Please generate and confirm your 2FA code first."
					});
				}
			}
			await db.run(
				"UPDATE users SET two_factor=? WHERE id=?",
				[new2FAState, userId]
			);
			const message = new2FAState === 1
				? "2FA activate successfully."
				: "2FA deactivate. Secret remains stored.";
			return reply.code(200).send({ message: message, is_2fa_enabled: new2FAState });

		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ message: "An server error occured while updating 2FA status." });
		}
	});

	fastify.post("/friends/request", async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			return ;
		}
		const requesterId = req.user.id;
		const { targetUserId } = req.body;
		if (!targetUserId || requesterId === targetUserId) {
			return reply.code(400).send({ message: "Invalid friend ID." });
		}
		try {
			const alreadyFriends = await db.get(
				`SELECT 1 FROM accepted_friends
					WHERE(
						(user_id = ? AND friend_id = ?) OR
						(user_id = ? AND friend_id = ?)
					)`,
					[requesterId, targetUserId, targetUserId, requesterId]
				);
			if (alreadyFriends)
				return reply.code(200).send({ message: "Already friends?", status: 1});
			const incomingRequest = await db.get (
				`SELECT 1 FROM friend_requests
				WHERE user_id = ? AND friend_id = ?`,
				[targetUserId, requesterId]
			);
			if (incomingRequest) {
				// Accepte l’amitié
				await db.exec("BEGIN");
				await db.run(
					`INSERT OR IGNORE INTO accepted_friends (user_id, friend_id)
					VALUES (?, ?)`,
					[requesterId, targetUserId]
				);
				// Supprime toutes les demandes pendantes entre les deux
				await db.run(
					`DELETE FROM friend_requests
					WHERE (user_id = ? AND friend_id = ?)
						OR (user_id = ? AND friend_id = ?)`,
					[requesterId, targetUserId, targetUserId, requesterId]
				);
				await db.exec("COMMIT");
				return reply.code(202).send({ message: "Friend request matched and accepted.", status: 1 });
			}
			await db.run(
			`INSERT INTO friend_requests (user_id, friend_id) VALUES (?, ?)`,
			[requesterId, targetUserId]
			);
			return reply.code(201).send({ message: "Friend request sent successfully.", status: 0 });
		} catch (err) {
			if (err.code === 'SQLITE_CONSTRAINT') {
				return reply.code(202).send({ message: "Friend request already exists between these users." });
			}
			console.error("Erreur DB lors de l'ajout d'ami:", err);
			return reply.code(500).send({ message: "Intern server error." });
		}
	});

	fastify.get("/friends/request/:id", async (req, reply) => {
		try { await authenticate(req, reply); } catch { return; }
		const me = req.user.id;
		try {
			const rows = await db.all(
				`SELECT u.id, u.name, u.avatar, u.status, u.species, u.planet, u.dimension
				 FROM friend_requests f
				 JOIN users u ON u.id = f.user_id
				 WHERE f.friend_id = ?`,
				[me]
			);
			return reply.code(200).send(rows);
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ error: "Failed to fetch incoming requests." });
		}
	});

	fastify.delete("/users/:id", async (req, reply) => {
		try {
			const result = await db.run("DELETE FROM users WHERE id=?", [req.params.id]);
			if (result.changes === 0) return reply.code(404).send({ message: "User not found." });
			return reply.code(201).send({ message: "User deleted successfully." });
		} catch (err) {
			return reply.code(500).send({ error: "Internal Error" });
		}
	});

	fastify.get("/users/friends/:id", async (req, reply) => {
		try {await authenticate(req, reply); } catch { return; }
		const me = req.user.id;
		try {
			const rows = await db.all(
				`SELECT 
					CASE 
						WHEN f.user_id = ? THEN f.friend_id
						ELSE f.user_id
					END AS friend_id,
					u.id,
					u.name,
					u.avatar,
					u.status,
					u.species,
					u.planet,
					u.dimension
				FROM accepted_friends f
				JOIN users u 
					ON u.id = CASE 
								WHEN f.user_id = ? THEN f.friend_id 
								ELSE f.user_id 
							END
				WHERE ? IN (f.user_id, f.friend_id)`,
				[me, me, me]
			);
			reply.code(201).send(rows);
		} catch (err) {
			return reply.code(500).send({ error: "Failed to fetch incoming requests."})
		}
	});

	fastify.delete("/users/friends/:id", async (req, reply) => {
		try {
			await authenticate(req, reply);
		} catch (err) {
			console.log(err);
			return reply.code(405).send({ error: "Failed to autentificate "});
		}
		const me = Number(req.user?.id);
		const other = Number(req.params.id);
		try {
			const result = await db.run(
				`DELETE FROM accepted_friends
					WHERE (user_id = ? AND friend_id = ?)
						`,
	 				[me, other]
			);
			console.log(result);
			if (result.changes === 0) return reply.code(404).send({ message: "Friend not found." });
			return reply.code(201).send({ message: "Friend deleted successfully." });
		} catch (err) {
			console.log(err);
			return reply.code(500).send({ error: "Internal Error" });
		}
	});
}

export default userRoutes;
