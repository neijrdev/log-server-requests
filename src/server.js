// src/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para parsing de JSON
app.use(express.json());

// Servir o front-end (HTML simples)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Aqui, adicione um middleware para emitir o log pelo WebSocket
app.post("/logs", (req, res) => {
  const { type, logData } = req.body;
  // Emita o log via WebSocket para todos os clientes conectados
  io.emit("log", { type, logData });

  res.sendStatus(200);
});

// WebSocket para enviar logs em tempo real
io.on("connection", (socket) => {
  console.log("A user connected");

  // Desconexão do WebSocket
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Iniciando o servidor
server.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
