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
  console.log("BODY RECEBIDO:");
  console.log(JSON.stringify(req.body, null, 2));

  console.log("=================================");
  console.log("TIPO DA CHAVE:", typeof process.env.OPENAI_API_KEY);
  console.log("TAMANHO DA CHAVE:", process.env.OPENAI_API_KEY?.length);
  console.log(
    "CHAVE ENCONTRADA:",
    process.env.OPENAI_API_KEY ? "SIM" : "NÃO"
  );
  console.log("=================================");

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
              "Olá! Sou a Delivery House 🍕 Faça seu pedido em www.pizzariadeliveryhouse.com.br"
          }
        ]
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é a atendente virtual da Pizzaria Delivery House.

Responda sempre em português.

Nunca diga que é uma IA.

Informações:
- Nome: Delivery House
- Cardápio: www.pizzariadeliveryhouse.com.br
- Horário: 18h às 23h20
- Quando o cliente quiser pedir, envie o link do cardápio.`
        },
        {
          role: "user",
          content: String(mensagem)
        }
      ]
    });

    return res.json({
      replies: [
        {
          message: resposta.choices[0].message.content
        }
      ]
    });

  } catch (erro) {
    console.error("ERRO OPENAI:");
    console.error(erro);

    return res.json({
      replies: [
        {
          message:
            "Olá! Sou a Delivery House 🍕 Faça seu pedido em www.pizzariadeliveryhouse.com.br"
        }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});