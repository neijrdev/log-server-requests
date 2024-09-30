// src/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const logsRouter = require("./routes/logs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para parsing de JSON
app.use(express.json());

// Rotas
app.use("/logs", logsRouter);

// Servir o front-end (HTML simples)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// WebSocket para enviar os logs em tempo real
io.on("connection", (socket) => {
  console.log("A user connected");
});

// Iniciando o servidor
server.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
