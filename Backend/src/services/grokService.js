// src/services/grokService.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_MODEL = "grok-4";
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

if (!GROK_API_KEY) {
  console.warn("WARNING: GROK_API_KEY is not set in .env");
}

export async function askGrok(prompt) {
  if (!prompt || !prompt.toString().trim()) {
    throw new Error("prompt is empty");
  }

  const body = {
    model: GROK_MODEL,
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

  const res = await axios.post(GROK_API_URL, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROK_API_KEY}`,
    },
    timeout: 60000,
  });

  const reply = res.data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Grok returned an empty or invalid response format");
  }

  return reply;
}

const grokService = { askGrok };
export default grokService;
