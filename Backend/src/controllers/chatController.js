// src/controllers/chatController.js
import { askAIWithFallback } from "../services/chatbotService.js";
import { getChildrenFullInfoByUserId } from "../services/childModel.js";

export async function chatWithChildrenInfo(req, res) {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    if (!prompt || !prompt.toString().trim()) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const children = await getChildrenFullInfoByUserId(userId);

    const contextJson = JSON.stringify(children, null, 2);

    const fullPrompt = `
You are an AI assistant that helps parents understand their children's health and development.

Below is the complete data about the user's child/children (JSON taken directly from the database, NOT truncated):
${contextJson}

The user asks:
"${prompt}"

Requirements:
- Answer in English, in a friendly and easy-to-understand way.
- Always base your answer on the JSON data above; do not invent any information that is not present in the JSON.
- If the data is insufficient, clearly say that it is insufficient and only respond at a general level.
`;

    const reply = await askAIWithFallback(fullPrompt);

    return res.status(200).json({
      reply,
      childrenCount: children.length,
    });
  } catch (error) {
    const err = error?.response?.data || error;

    if (error?.response?.status === 503) {
      console.error("Gemini overloaded:", err);
      return res.status(503).json({
        error: "The AI service is currently overloaded. Please try again in a few minutes.",
      });
    }

    console.error("chatWithChildrenInfo error:", err);
    return res.status(500).json({
      error: "Server error while calling the chatbot.",
      details: error.message || "Unknown error",
    });
  }
}

const chatController = { chatWithChildrenInfo };
export default chatController;
