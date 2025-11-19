// src/services/geminiService.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

if (!API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in .env");
}

export async function askGeminiWithRest(fullPrompt) {
  if (!fullPrompt || !fullPrompt.toString().trim()) {
    throw new Error("fullPrompt is empty");
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: fullPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  };

  const url = `${BASE_URL}?key=${API_KEY}`;

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(
        "Gemini prompt preview:",
        body.contents[0].parts[0].text.slice(0, 200).replace(/\n/g, " ")
      );

      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });

      const candidate = response.data?.candidates?.[0] || {};
      const parts = candidate?.content?.parts || [];

      // Merge all text parts (if any)
      let reply = parts
        .map((p) => p.text || "")
        .join("")
        .trim();

      if (!reply) {
        const finish = candidate?.finishReason || "UNKNOWN";

        console.warn(
          "Full Gemini response (no text):",
          JSON.stringify(response.data).slice(0, 1000)
        );

        if (finish === "MAX_TOKENS") {
          reply =
            "The answer was too long so the AI system had to cut it off. " +
            "Please try asking a shorter question or focus on one specific topic (for example: only one child or one particular vaccine dose).";
        } else {
          reply =
            "The AI system did not return a suitable response. " +
            "Please try rephrasing your question in a simpler way or break it into smaller questions.";
        }
      }

      return reply;
    } catch (err) {
      // Only retry if the server is overloaded (503)
      if (err.response?.status === 503 && attempt < 3) {
        lastError = err;
        console.error("Gemini overloaded:", err.response.data);
        const delayMs = 1000 * attempt; // 1s, 2s
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }

      // Other errors are thrown back to the controller
      throw err;
    }
  }

  // After 3 retries we still get 503
  throw lastError || new Error("Gemini UNAVAILABLE");
}

const geminiService = { askGeminiWithRest };
export default geminiService;
