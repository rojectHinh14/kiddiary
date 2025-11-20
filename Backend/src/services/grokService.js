// src/services/groqService.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_KEY = process.env.GROK_API_KEY; // 👈 đổi tên biến cho đúng
const GROQ_MODEL = "llama-3.1-70b-versatile"; // hoặc model khác bạn muốn
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.warn("WARNING: GROQ_API_KEY is not set in .env");
}

export async function askGroq(prompt) {
  if (!prompt || !prompt.toString().trim()) {
    throw new Error("prompt is empty");
  }

  const body = {
    model: GROQ_MODEL,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant for parents. Answer in English, in a friendly and easy-to-understand way.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const res = await axios.post(GROQ_API_URL, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    timeout: 60000,
  });

  const reply = res.data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Groq returned an empty or invalid response format");
  }

  return reply;
}

const groqService = { askGroq };
export default groqService;
