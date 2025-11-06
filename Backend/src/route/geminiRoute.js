import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { verifyToken } from "../middleware/verifyToken.js";
import chatbotService from "../services/chatbotService.js";
import chatbotLogService from "../services/chatbotLogService.js";

dotenv.config();
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in .env");
}

const MODEL_NAME = "gemini-2.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;

/**
 * Enhanced chatbot với database integration
 */
router.post("/chat", verifyToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id; // Lấy từ token

    if (!prompt || !prompt.toString().trim()) {
      return res.status(400).json({ error: "Thiếu prompt." });
    }

    console.log(`💬 User ${userId} asked: ${prompt}`);

    // Step 1: Query database trước
    let dbResults = null;
    let contextForGemini = "";

    try {
      dbResults = await chatbotService.processUserQuery(userId, prompt);

      if (dbResults.totalResults > 0) {
        // Tạo context cho Gemini
        contextForGemini = `
Dữ liệu từ database (${dbResults.totalResults} kết quả):
${JSON.stringify(dbResults.data, null, 2)}

Hãy phân tích và trả lời câu hỏi của user dựa trên dữ liệu này. 
- Nếu là albums: liệt kê tên album và số lượng ảnh
- Nếu là media: mô tả ảnh và cung cấp link URL
- Trả lời bằng tiếng Việt tự nhiên, thân thiện
`;
      } else {
        contextForGemini = `
Không tìm thấy kết quả nào trong database của user.
Hãy trả lời lịch sự rằng không tìm thấy ảnh/album phù hợp và gợi ý user thử từ khóa khác.
`;
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      contextForGemini = "Có lỗi khi truy vấn database. Hãy xin lỗi user và đề nghị thử lại.";
    }

    // Step 2: Gọi Gemini với context từ database
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${contextForGemini}\n\nCâu hỏi của user: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };

    const url = `${BASE_URL}?key=${API_KEY}`;
    const response = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });

    // Step 3: Extract reply từ Gemini
    let reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.data?.candidates?.[0]?.content?.[0]?.text ||
      null;

    if (!reply) {
      console.warn("Full Gemini response:", JSON.stringify(response.data).slice(0, 1000));
      return res.status(500).json({
        error: "Không parse được phản hồi từ Gemini.",
      });
    }

    // Step 4: Lưu lịch sử chat vào database
    try {
      await chatbotLogService.saveChatLog(userId, prompt, reply);
      console.log("✅ Chat log saved successfully");
    } catch (saveError) {
      console.error("⚠️ Failed to save chat log:", saveError);
      // Không throw error, vẫn trả response về cho user
    }

    // Step 5: Trả kết quả cho frontend
    return res.json({
      reply,
      dbResults: dbResults || null, // Trả raw data để frontend có thể render
      totalResults: dbResults?.totalResults || 0,
    });
  } catch (err) {
    if (err.response) {
      console.error("Gemini API error:", {
        status: err.response.status,
        data: err.response.data,
      });
      return res.status(500).json({
        error: "Lỗi khi gọi Gemini API.",
        details: err.response.data,
      });
    } else {
      console.error("Gemini API error:", err.message || err);
      return res.status(500).json({
        error: "Lỗi khi gọi Gemini API.",
        details: err.message,
      });
    }
  }
});

/**
 * Lấy lịch sử chat của user
 */
router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10; // Default 10 cặp

    const history = await chatbotLogService.getChatHistory(userId, limit);

    return res.json({
      success: true,
      history,
      total: history.length,
    });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    return res.status(500).json({
      error: "Lỗi khi tải lịch sử chat.",
      details: err.message,
    });
  }
});

/**
 * Xóa lịch sử chat của user
 */
router.delete("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await chatbotLogService.clearChatHistory(userId);

    return res.json({
      success: true,
      message: "Đã xóa lịch sử chat.",
      ...result,
    });
  } catch (err) {
    console.error("Error clearing chat history:", err);
    return res.status(500).json({
      error: "Lỗi khi xóa lịch sử chat.",
      details: err.message,
    });
  }
});

export default router;