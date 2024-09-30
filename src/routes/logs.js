// src/routes/logs.js
const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

// Armazena os logs recebidos
const logs = [];

// Rota para receber os logs das requisições/respostas interceptadas
router.post("/", (req, res) => {
  const { type, logData } = req.body;
  logs.push({ type, logData, timestamp: new Date().toISOString() });

  // Log no console usando Winston
  logger.info(`${type.toUpperCase()}: ${JSON.stringify(logData)}`);

  // Envia uma resposta de sucesso
  res.sendStatus(200);
});

module.exports = router;
