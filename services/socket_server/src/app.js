// import { Server } from "socket.io";

// const io = new Server(3000, {
// 	cors: { origin: "*" } // autorise le frontend à se connecter
// });

// let onlineUsers = new Set();

// io.on("connection", (socket) => {
// 	console.log("Nouvel utilisateur connecté");

// 	socket.on("login", (username) => {
// 		socket.username = username;
// 		onlineUsers.add(username);
// 		io.emit("update", Array.from(onlineUsers));
// 	});

// 	socket.on("disconnect", () => {
// 		onlineUsers.delete(socket.username);
// 		io.emit("update", Array.from(onlineUsers));
// 		console.log("Utilisateur déconnecté");
// 	});
// });

// console.log("Serveur WebSocket démarré sur le port 3000");
