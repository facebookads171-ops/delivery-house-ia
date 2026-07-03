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
  // Esse log é vital! Ele vai mostrar no Railway exatamente o que o app do celular enviou
  console.log("BODY RECEBIDO DO AUTO_RESPONDER:", JSON.stringify(req.body, null, 2));

  try {
    // Captura o texto enviado pelo AutoResponder para WA (geralmente vem em 'query')
    const mensagem =
      req.body?.query ||
      req.body?.message ||
      req.body?.text ||
      req.body?.body ||
      req.body?.msg ||
      "Olá";

    if (!process.env.OPENAI_API_KEY) {
      console.error("AVISO: Chave da OpenAI não encontrada nas variáveis de ambiente!");
      return res.json({
        replies: [{ message: "Olá! Sou a Delivery House 🍕 Como posso ajudar?" }]
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Chamada corrigida para o padrão atual da OpenAI
    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: `Você é a atendente virtual da Pizzaria Delivery House.
Responda em português, de forma curta, simpática e profissional.
Nunca diga que é uma IA da OpenAI.

Informações da pizzaria:
- Nome: Delivery House
- Site do cardápio: www.pizzariadeliveryhouse.com.br
- Horário: 18h às 23h20
- Quando o cliente quiser pedir, envie o link do cardápio.`
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    });

    // Extrai o texto gerado pela Inteligência Artificial
    const textoResposta = resposta.choices[0]?.message?.content || "Como posso ajudar?";

    // Retorna no formato esperado pelo AutoResponder para WA
    return res.json({
      replies: [
        {
          message: textoResposta
        }
      ]
    });

  } catch (erro) {
    // Se der qualquer erro na OpenAI, este log vai te dizer o motivo exato (Falta de saldo, chave inválida, etc)
    console.error("Erro detalhado na chamada da OpenAI:", erro);

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