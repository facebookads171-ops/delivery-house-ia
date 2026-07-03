require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Delivery House IA online 🍕");
});

app.get("/webhook", (req, res) => {
  res.send("Webhook Delivery House IA online");
});

app.post("/webhook", async (req, res) => {
  console.log("BODY RECEBIDO:", JSON.stringify(req.body, null, 2));

  try {
    const mensagem =
      req.body?.message ||
      req.body?.text ||
      req.body?.body ||
      req.body?.msg ||
      req.body?.query?.message ||
      req.body?.query ||
      req.body?.data?.message ||
      req.body?.notification?.message ||
      req.body?.senderMessage ||
      "Olá";

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        replies: [
          {
            message: "Olá! Sou a Delivery House 🍕 Como posso ajudar?"
          }
        ]
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const resposta = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Você é a atendente virtual da Pizzaria Delivery House.

Responda em português, de forma curta, simpática e profissional.
Nunca diga que é uma IA da OpenAI.

Informações da pizzaria:
- Nome: Delivery House
- Site do cardápio: www.pizzariadeliveryhouse.com.br
- Horário: 18h às 23h20
- Quando o cliente quiser pedir, envie o link do cardápio.

Mensagem do cliente:
${mensagem}
`
    });

    return res.json({
      replies: [
        {
          message: resposta.output_text || "Como posso ajudar?"
        }
      ]
    });

  } catch (erro) {
    console.error("Erro no webhook:", erro);

    return res.json({
      replies: [
        {
          message: "Olá! Sou a Delivery House 🍕 Faça seu pedido em www.pizzariadeliveryhouse.com.br"
        }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});