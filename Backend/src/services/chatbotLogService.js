const db = require("../models");
/**
 * Lưu lịch sử chat vào database
 */
const saveChatLog = async (userId, question, answer) => {
  try {
    const chatLog = await db.ChatbotLog.create({
      userId,
      question,
      answer,
    });

    return chatLog;
  } catch (error) {
    console.error("Error saving chat log:", error);
    throw error;
  }
};

/**
 * Lấy lịch sử chat của user (10 cặp gần nhất)
 */
const getChatHistory = async (userId, limit = 10) => {
  try {
    const chatLogs = await db.ChatbotLog.findAll({
      where: { userId },
      attributes: ["id", "question", "answer", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: limit, // Lấy 10 cặp (question + answer)
    });

    // Reverse để hiển thị từ cũ → mới
    return chatLogs.reverse();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

/**
 * Xóa toàn bộ lịch sử chat của user
 */
const clearChatHistory = async (userId) => {
  try {
    const result = await db.ChatbotLog.destroy({
      where: { userId },
    });

    return { message: "Chat history cleared", deletedCount: result };
  } catch (error) {
    console.error("Error clearing chat history:", error);
    throw error;
  }
};

export default {
  saveChatLog,
  getChatHistory,
  clearChatHistory,
};
