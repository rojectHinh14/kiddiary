import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in .env");
}

// Sử dụng model gemini-2.5-flash 
const MODEL_NAME = "gemini-2.5-flash";
// REST endpoint v1
const BASE_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.toString().trim()) {
      return res.status(400).json({ error: "Thiếu prompt." });
    }

    // Body theo định dạng REST generateContent (contents -> parts -> text)
    const body = {
      // contents là mảng; mỗi item có thể có parts (các phần text)
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      // bạn có thể thêm các tham số khác ở đây (temperature, maxOutputTokens, ...)
    };

    const url = `${BASE_URL}?key=${API_KEY}`;
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Cố gắng lấy text từ các trường hay xuất hiện trong response
    let reply = null;

    // Thử đường dẫn candidates[].content.parts[].text (hay gặp)
    reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.data?.candidates?.[0]?.content?.[0]?.text ||
      response.data?.output?.[0]?.content?.parts?.[0]?.text ||
      response.data?.output?.[0]?.content?.[0]?.text ||
      response.data?.result?.content?.[0]?.text ||
      null;

    // Nếu không tìm thấy, fallback: stringify whole response for debug (short)
    if (!reply) {
      // Trả lại một chuỗi ngắn (không gửi nguyên response to lớn lên client)
      console.warn("Full Gemini response (short):", JSON.stringify(response.data).slice(0, 1000));
      return res.status(500).json({ error: "Không parse được phản hồi từ Gemini. Kiểm tra log server." });
    }

    return res.json({ reply });
  } catch (err) {
    // Log chi tiết cho debug (Ẩn API key nếu in url)
    if (err.response) {
      console.error("Gemini API error response:", {
        status: err.response.status,
        data: err.response.data,
      });
      return res.status(500).json({ error: "Lỗi khi gọi Gemini API.", details: err.response.data });
    } else {
      console.error("Gemini API error:", err.message || err);
      return res.status(500).json({ error: "Lỗi khi gọi Gemini API.", details: err.message });
    }
  }
});

export default router;
