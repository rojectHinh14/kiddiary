import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

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

      // Ghép text nếu có
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
            "Câu trả lời quá dài nên hệ thống AI đã phải cắt bớt. " +
            "Bạn hãy thử hỏi ngắn hơn hoặc tập trung vào một vấn đề cụ thể (ví dụ: chỉ hỏi về một bé hoặc một mũi tiêm).";
        } else {
          reply =
            "Hiện tại hệ thống AI không trả về nội dung phù hợp. " +
            "Bạn hãy thử diễn đạt lại câu hỏi đơn giản hơn hoặc chia nhỏ câu hỏi nhé.";
        }
      }

      // ✅ Tới đây DÙ có hay không có text gốc, mình luôn có reply → RETURN, KHÔNG throw
      return reply;
    } catch (err) {
      // Chỉ retry nếu server quá tải 503
      if (err.response?.status === 503 && attempt < 3) {
        lastError = err;
        console.error("Gemini overloaded:", err.response.data);
        const delayMs = 1000 * attempt; // 1s, 2s
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }

      // Các lỗi khác thì trả cho controller xử lý
      throw err;
    }
  }

  // Sau 3 lần retry mà vẫn 503
  throw lastError || new Error("Gemini UNAVAILABLE");
}

const geminiService = { askGeminiWithRest };
export default geminiService;
