// src/services/aiService.js
import { askGeminiWithRest } from "./geminiService.js";
import { askGrok } from "./grokService.js";

/**
 * Hỏi AI với ưu tiên Gemini, nếu fail thì fallback sang Grok
 */
export async function askAIWithFallback(fullPrompt) {
  // 1. Thử Gemini trước
  try {
    const reply = await askGeminiWithRest(fullPrompt);
    return {
      provider: "gemini",
      reply,
    };
  } catch (err) {
    console.error("❌ Gemini lỗi, fallback sang Grok:", err?.response?.data || err);
  }

  // 2. Nếu Gemini lỗi, thử Grok
  try {
    const reply = await askGrok(fullPrompt);
    return {
      provider: "grok",
      reply,
    };
  } catch (err2) {
    console.error("❌ Grok cũng lỗi:", err2?.response?.data || err2);
    // Nếu cả hai đều chết thì throw để controller trả lỗi cho client
    throw new Error("Cả Gemini và Grok đều không dùng được.");
  }
}

const aiService = { askAIWithFallback };
export default aiService;
