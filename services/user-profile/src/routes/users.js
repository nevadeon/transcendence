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
            fastify.log.error('JWT Verification Failed:', err);
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
        console.log("\n\nuserID: \n\n", userId);
        try {
            const users = await db.all("SELECT id, name, avatar, status, species, planet, dimension FROM users WHERE id!=?", [userId]);
            console.log("\n\nusers: \n\n", users);
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
		const SECRET_SALT = await getVaultSecret("user-profile/config", "SECRET_SALT");
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
				return reply.code(409).send({ error: "PASSWORD ALREADY EXISTS" });
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
                return reply.code(404).send({ message: "Utilisateur non trouvé." });
            }
            return reply.code(200).send({
                is_2fa_enabled: user.two_factor === 1,
                has_secret: !!user.two_factor_secret
            });
        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send({ message: "Erreur serveur lors de la récupération du statut 2FA." });
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
                 return reply.code(404).send({ message: "Utilisateur non trouvé ou email manquant." });
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
            return reply.code(500).send({ message: "Erreur serveur lors de la génération du secret 2FA." });
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
                    message: "Le secret 2FA n'a pas été trouvé. Veuillez régénérer le QR Code."
                });
			}
            const secret = userCheck.two_factor_secret;
            const isValid = authenticator.verify({ token, secret });
            if (!isValid) {
                return reply.code(401).send({ message: "Code 2FA incorrect ou expiré." });
            }

            await db.run(
                "UPDATE users SET two_factor=? WHERE id=?",
                [1, userId]
            );
            return reply.code(200).send({ message: "2FA activé et confirmé avec succès !", is_2fa_enabled: 1 });
        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send({ message: "Erreur serveur lors de la vérification 2FA." });
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
                        message: "Veuillez d'abord générer et confirmer votre code 2FA."
                    });
                }
            }
            await db.run(
                "UPDATE users SET two_factor=? WHERE id=?",
                [new2FAState, userId]
            );
            const message = new2FAState === 1
                ? "2FA activé avec succès."
                : "2FA désactivé. Le secret est toujours stocké.";
            return reply.code(200).send({ message: message, is_2fa_enabled: new2FAState });

        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send({ message: "Erreur serveur lors de la mise à jour du statut 2FA." });
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
            return reply.code(400).send({ message: "ID d'ami invalide ou tentative d'ajout de soi-même." });
        }
        try {
            await db.run(
                `INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 0)`,
                [requesterId, targetUserId]
            );
            return reply.code(201).send({
                message: "Demande d'ami envoyée avec succès.",
                status: 0
            });
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return reply.code(409).send({ message: "Une demande d'ami existe déjà entre ces utilisateurs." });
            }
            console.error("Erreur DB lors de l'ajout d'ami:", err);
            return reply.code(500).send({ message: "Erreur interne du serveur." });
        }
    });

	fastify.delete("/users/:id", async (req, reply) => {
		const result = await db.run("DELETE FROM users WHERE id=?", [req.params.id]);
		if (result.changes === 0) return reply.code(404).send({ error: "User not found" });
		return { message: "Deleted successfully" };
	});
}

export default userRoutes;
