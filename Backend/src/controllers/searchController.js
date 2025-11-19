import SearchbarService from "../services/SearchbarService.js";

/**
 * Search media/albums theo query string
 * GET /api/search?q=tìm ảnh tháng 10
 */
const searchMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ 
        errCode: 1, 
        message: "Missing search query" 
      });
    }

    console.log(`🔍 User ${userId} searching: ${q}`);

    // Sử dụng chatbotService để query database
    const results = await SearchbarService.processUserQuery(userId, q);

    return res.status(200).json({
      errCode: 0,
      message: "Search completed",
      query: q,
      totalResults: results.totalResults,
      searchType: results.searchType,
      data: results.data,
    });
  } catch (err) {
    console.error("Error in search:", err);
    return res.status(500).json({
      errCode: -1,
      message: "Server error",
      error: err.message,
    });
  }
};

export default {
  searchMedia,
};