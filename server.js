require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Delivery House IA online 🍕");
});

app.post("/webhook", async (req, res) => {
  console.log("Mensagem recebida:", req.body);

  res.json({
    replies: [
      {
        message: "Olá! Sou a IA da Delivery House 🍕 Como posso ajudar?"
      }
    ]
  });
});

app.get("/webhook", (req, res) => {
  res.send("Webhook Delivery House IA online");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});