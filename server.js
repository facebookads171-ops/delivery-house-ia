require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Delivery House IA online 🍕");
});

app.get("/webhook", (req, res) => {
  res.send("Webhook Delivery House IA online");
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Mensagem recebida:", req.body);

    // Tenta localizar a mensagem enviada pelo cliente
    const mensagem =
      req.body.message ||
      req.body.text ||
      req.body.body ||
      req.body.msg ||
      req.body.query ||
      "";

    if (!mensagem) {
      return res.json({
        replies: [
          {
            message: "Olá! Como posso ajudar?"
          }
        ]
      });
    }

    const resposta = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Você é a atendente virtual da Pizzaria Delivery House.

Regras:
- Responda em português.
- Seja simpática.
- Respostas curtas.
- Nunca diga que é uma IA da OpenAI.
- Quando não souber um preço, peça para consultar o cardápio.
- Incentive o cliente a fazer o pedido.

Mensagem do cliente:
${mensagem}
`
    });

    const texto =
      resposta.output_text ||
      "Desculpe, não consegui responder agora.";

    res.json({
      replies: [
        {
          message: texto
        }
      ]
    });

  } catch (erro) {
    console.error(erro);

    res.json({
      replies: [
        {
          message: "Desculpe, ocorreu um erro. Tente novamente em alguns instantes."
        }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});