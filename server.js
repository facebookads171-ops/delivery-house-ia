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
  console.log(
    "OPENAI_API_KEY:",
    process.env.OPENAI_API_KEY ? "ENCONTRADA" : "NÃO ENCONTRADA"
  );

  try {
    const mensagem =
      req.body?.query?.message ||
      req.body?.message ||
      req.body?.text ||
      req.body?.body ||
      req.body?.msg ||
      "Olá";

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        replies: [
          {
            message:
              "Olá! Sou a Delivery House 🍕 Faça seu pedido em www.pizzariadeliveryhouse.com.br",
          },
        ],
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é a atendente virtual da Pizzaria Delivery House.
Responda em português do Brasil, de forma curta, simpática e profissional.
Nunca diga que é uma IA da OpenAI.

Informações:
- Nome: Delivery House
- Cardápio: www.pizzariadeliveryhouse.com.br
- Horário: 18h às 23h20
- Para pedidos, envie o link do cardápio.
- Se perguntarem preço, sabores ou promoções, oriente a conferir no cardápio.`,
        },
        {
          role: "user",
          content: String(mensagem),
        },
      ],
    });

    const textoResposta =
      resposta.choices[0]?.message?.content || "Olá! Como posso ajudar?";

    return res.json({
      replies: [
        {
          message: textoResposta,
        },
      ],
    });
  } catch (erro) {
    console.error("ERRO OPENAI:", erro);

    return res.json({
      replies: [
        {
          message:
            "Olá! Sou a Delivery House 🍕 Faça seu pedido em www.pizzariadeliveryhouse.com.br",
        },
      ],
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});