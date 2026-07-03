require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Página inicial
app.get("/", (req, res) => {
  res.send("Delivery House IA online 🍕");
});

// Webhook para o AutoResponder
app.post("/webhook", async (req, res) => {
  console.log("Mensagem recebida:", req.body);

  res.json({
    reply: "Olá! Sou a IA da Delivery House 🍕 Como posso ajudar?"
  });
});

// Teste do webhook no navegador
app.get("/webhook", (req, res) => {
  res.send("Webhook Delivery House IA online");
});

// Porta do Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});