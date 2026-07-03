const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Delivery House IA online 🍕");
});

async function gerarResposta(mensagem) {
  if (!mensagem) {
    return "Olá! Como posso ajudar no seu pedido? 🍕";
  }

  const resposta = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é o atendente virtual da Pizzaria Delivery House. Responda de forma curta, educada e objetiva. Ajude clientes com pedidos, sabores de pizza, horários, entrega e formas de pagamento. Sempre incentive o cliente a finalizar o pedido pelo cardápio digital: www.pizzariadeliveryhouse.com.br",
      },
      {
        role: "user",
        content: mensagem,
      },
    ],
  });

  return resposta.choices[0].message.content;
}

app.post("/webhook", async (req, res) => {
  console.log("Headers:", req.headers);
console.log("Body:", JSON.stringify(req.body, null, 2));
  try {
    const mensagem =
      req.body.message ||
      req.body.mensagem ||
      req.body.text ||
      req.body.query ||
      req.body.body ||
      "";

    const textoResposta = await gerarResposta(mensagem);

    res.json({
      replies: [
        {
          message: textoResposta,
        },
      ],
    });
  } catch (error) {
    console.error(error);

    res.json({
      replies: [
        {
          message:
            "Desculpe, tive uma instabilidade agora. Por favor, tente novamente em instantes. 🍕",
        },
      ],
    });
  }
});

app.get("/webhook", async (req, res) => {
  try {
    const mensagem = req.query.message || req.query.text || req.query.query || "";
    const textoResposta = await gerarResposta(mensagem);

    res.json({
      replies: [
        {
          message: textoResposta,
        },
      ],
    });
  } catch (error) {
    console.error(error);

    res.json({
      replies: [
        {
          message:
            "Desculpe, tive uma instabilidade agora. Por favor, tente novamente em instantes. 🍕",
        },
      ],
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});