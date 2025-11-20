// src/controllers/chatController.js
import { askAIWithFallback } from "../services/chatbotService.js"; // hoặc aiService.js tuỳ bạn đặt tên
import { getChildrenFullInfoByUserId } from "../services/childModel.js";

const MAX_CHILDREN = 3;
const MAX_HISTORY = 5;
const MAX_MILK_LOGS = 10;
const MAX_SLEEP_LOGS = 10;
const MAX_VACCINE_DOSES = 33;

export async function chatWithChildrenInfo(req, res) {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    if (!prompt || !prompt.toString().trim()) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // 1. Lấy FULL dữ liệu từ DB
    const children = await getChildrenFullInfoByUserId(userId);

    // 2. Giới hạn dữ liệu trước khi gửi sang AI
    const trimmedChildren = children.slice(0, MAX_CHILDREN).map((c) => ({
      // basic info
      id: c.id,
      userId: c.userId,
      firstName: c.firstName,
      lastName: c.lastName,
      dob: c.dob,
      genderCode: c.genderCode,
      avatarUrl: c.avatarUrl,
      currentWeight: c.currentWeight,
      currentHeight: c.currentHeight,

      // growth history: chỉ lấy vài bản ghi mới nhất
      histories: (c.histories || []).slice(0, MAX_HISTORY).map((h) => ({
        id: h.id,
        date: h.date,
        weight: h.weight,
        height: h.height,
      })),

      // milk logs: giới hạn + bỏ bớt field không cần
      milkLogs: (c.milkLogs || []).slice(0, MAX_MILK_LOGS).map((m) => ({
        id: m.id,
        feedingAt: m.feedingAt,
        amountMl: m.amountMl,
        moodTags: m.moodTags,
        note: m.note,
      })),

      // sleep logs: giới hạn
      sleepLogs: (c.sleepLogs || []).slice(0, MAX_SLEEP_LOGS).map((s) => ({
        id: s.id,
        sleepDate: s.sleepDate,
        startTime: s.startTime,
        endTime: s.endTime,
        duration: s.duration,
        quality: s.quality,
        note: s.note,
      })),

      // vaccines: bỏ các field text dài, chỉ giữ thông tin cần
      vaccines: (c.vaccines || []).slice(0, MAX_VACCINE_DOSES).map((v) => ({
        childVaccineDoseId: v.childVaccineDoseId,
        vaccineStatus: v.vaccineStatus,
        injectedDate: v.injectedDate,
        vaccineNote: v.vaccineNote,

        vaccineDoseId: v.vaccineDoseId,
        doseNumber: v.doseNumber,
        recommendedAge: v.recommendedAge,

        vaccineId: v.vaccineId,
        vaccinationType: v.vaccinationType,
        diseaseName: v.diseaseName,
        vaccineName: v.vaccineName,
        // KHÔNG gửi about/description/symptoms để tiết kiệm token
      })),
    }));

    const contextJson = JSON.stringify(trimmedChildren, null, 2);

    // 3. Prompt gọn + note rõ là đã giới hạn dữ liệu
    const fullPrompt = `
You are an AI assistant that helps parents understand their children's health and development.

Below is a LIMITED BUT REPRESENTATIVE subset of data about the user's child/children.
The JSON was taken from the database, but it is truncated to the most recent records
(for example, only a few latest growth, milk, sleep, and vaccine entries are shown):

${contextJson}

The user asks:
"${prompt}"

Requirements:
- Answer in English, in a friendly and easy-to-understand way.
- Always base your answer on the JSON data above; do not invent any information that is not present.
- If some information is missing because of truncation, clearly say that the data is not available in this snippet.
`;

    // 4. Gọi AI (Gemini trước, rồi fallback sang Groq)
    const aiResult = await askAIWithFallback(fullPrompt);

    return res.status(200).json({
      reply: aiResult, // hoặc aiResult.reply nếu bạn chỉ cần text
      childrenCount: children.length,
    });
  } catch (error) {
    const err = error?.response?.data || error;

    if (error?.response?.status === 503) {
      console.error("AI service overloaded:", err);
      return res.status(503).json({
        error:
          "The AI service is currently overloaded. Please try again in a few minutes.",
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
