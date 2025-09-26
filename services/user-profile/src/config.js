export default {
	dbPath: process.env.DB_PATH || "./user-profile.sqlite",
	jwtSecret: process.env.JWT_SECRET || "super-secret-key",
	port: process.env.PORT || 3001,
};
