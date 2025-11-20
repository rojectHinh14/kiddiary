// src/services/chatbotService.js
import { askGeminiWithRest } from "./geminiService.js";
import { askGroq } from "./grokService.js";

export async function askAIWithFallback(fullPrompt) {
  // 1. Thử Gemini trước
  try {
    const reply = await askGeminiWithRest(fullPrompt);
    return {
      provider: "gemini",
      reply,
    };
  } catch (err) {
    console.error(
      "❌ Gemini lỗi, fallback sang Groq:",
      err?.response?.data || err
    );
  }

  // 2. Nếu Gemini lỗi, thử Groq
  try {
    const reply = await askGroq(fullPrompt);
    return {
      provider: "groq",
      reply,
    };
  } catch (err2) {
    console.error("❌ Groq cũng lỗi:", err2?.response?.data || err2);
    throw new Error("Cả Gemini và Groq đều không dùng được.");
  }
}

const aiService = { askAIWithFallback };
export default aiService;
