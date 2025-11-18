// src/controllers/chatController.js
import { askAIWithFallback } from "../services/chatbotService.js";
import { getChildrenFullInfoByUserId } from "../services/childModel.js";
import { askGeminiWithRest } from "../services/geminiService.js";

export async function chatWithChildrenInfo(req, res) {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    if (!prompt || !prompt.toString().trim()) {
      return res.status(400).json({ error: "Thiếu prompt." });
    }

    // 1. Lấy dữ liệu con cái từ DB
    const children = await getChildrenFullInfoByUserId(userId);

    // 2. Rút gọn dữ liệu cho mỗi bé
    const trimmedChildren = children.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      dob: c.dob,
      genderCode: c.genderCode,
      currentWeight: c.currentWeight,
      currentHeight: c.currentHeight,

      histories: (c.histories || []).slice(0, 3),
      milkLogs: (c.milkLogs || []).slice(0, 3),
      sleepLogs: (c.sleepLogs || []).slice(0, 3),

      vaccines: (c.vaccines || [])
        .slice(0, 15)
        .map((v) => ({
          vaccineName: v.vaccineName,
          status: v.status,
          recommendedDate: v.recommendedDate,
        })),
    }));

    // 3. Tóm tắt thông tin từng bé thành text ngắn
    const childrenSummary = buildChildrenSummary(trimmedChildren);

    // 4. Tạo prompt gửi cho Gemini
    const fullPrompt = `
Bạn là trợ lý cho phụ huynh.

Thông tin tóm tắt về các bé:
${childrenSummary}

Người dùng hỏi:
"${prompt}"

Yêu cầu:
- Trả lời bằng tiếng Việt, thân thiện, dễ hiểu.
- Nếu dữ liệu không đủ, hãy nói rõ và chỉ trả lời ở mức tổng quát.
- Đừng bịa ra dữ liệu y tế cụ thể nếu không có trong thông tin tóm tắt.
`;

    // 5. Gọi Gemini (fallback MAX_TOKENS xử lý bên trong service)
    const reply = await askAIWithFallback(fullPrompt);

    return res.status(200).json({
      reply,
      childrenCount: children.length,
    });
  } catch (error) {
    const err = error?.response?.data || error;

    // Nếu Gemini trả 503 (quá tải)
    if (error?.response?.status === 503) {
      console.error("Gemini overloaded:", err);
      return res.status(503).json({
        error: "Hiện tại máy chủ AI đang quá tải, vui lòng thử lại sau ít phút.",
      });
    }

    console.error("chatWithChildrenInfo error:", err);
    return res.status(500).json({
      error: "Lỗi server khi gọi chatbot.",
      details: error.message || "Unknown error",
    });
  }
}

// ----- Helper functions -----

function summarizeVaccinesForChild(child) {
  const injected = [];
  const skipped = [];
  const notInjected = [];

  for (const v of child.vaccines || []) {
    if (v.status === "injected") injected.push(v.vaccineName);
    else if (v.status === "skipped") skipped.push(v.vaccineName);
    else notInjected.push(v.vaccineName);
  }

  const parts = [];
  if (injected.length) parts.push(`Đã tiêm: ${injected.join(", ")}.`);
  if (skipped.length) parts.push(`Đã bỏ lỡ/skip: ${skipped.join(", ")}.`);
  if (notInjected.length) parts.push(`Chưa tiêm: ${notInjected.join(", ")}.`);

  return parts.join(" ");
}

function buildChildrenSummary(children) {
  return children
    .map((c) => {
      const name = `${c.firstName} ${c.lastName}`.trim();
      const dob = c.dob ? new Date(c.dob).toISOString().slice(0, 10) : "không rõ";

      const latestHistory = (c.histories || [])[0];
      const growth = latestHistory
        ? `cân nặng gần nhất ${latestHistory.weight}kg, chiều cao ${latestHistory.height}cm`
        : `cân nặng hiện tại ${c.currentWeight}kg, chiều cao ${c.currentHeight}cm`;

      const vaccinesText = summarizeVaccinesForChild(c);

      return `- Bé ${name} (sinh ngày ${dob}), ${growth}. ${vaccinesText}`;
    })
    .join("\n");
}

const chatController = { chatWithChildrenInfo };
export default chatController;
