import db from "../models/index.js";
import { Op } from "sequelize";

/**
 * Phân tích intent từ câu hỏi (Hỗ trợ cả tiếng Việt và tiếng Anh)
 * Trả về: { searchType, keywords, dateFilter, monthFilter, yearFilter }
 */
const analyzeIntent = (prompt) => {
  const lowerPrompt = prompt.toLowerCase().trim();

  // Detect search type (bilingual)
  let searchType = "general";

  if (lowerPrompt.includes("album") || lowerPrompt.includes("bộ ảnh")) {
    searchType = "album";
  } else if (
    lowerPrompt.includes("ảnh") ||
    lowerPrompt.includes("hình") ||
    lowerPrompt.includes("photo") ||
    lowerPrompt.includes("image") ||
    lowerPrompt.includes("picture")
  ) {
    searchType = "media";
  } else if (
    lowerPrompt.includes("ngày") ||
    lowerPrompt.includes("tháng") ||
    lowerPrompt.includes("năm") ||
    lowerPrompt.includes("day") ||
    lowerPrompt.includes("month") ||
    lowerPrompt.includes("year") ||
    /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(lowerPrompt)
  ) {
    // Nếu chưa xác định loại media/album, nhưng có yếu tố thời gian, coi là tìm kiếm media theo ngày
    if (searchType === "general") {
      searchType = "date";
    }
  }

  // --- 1. EXTRACT DATE/MONTH/YEAR FILTER (Và ghi lại các từ đã dùng làm filter) ---
  let dateFilter = null;
  let monthFilter = null;
  let yearFilter = null;
  const wordsToRemoveFromKeywords = []; // Mảng mới để lưu các từ/số đã dùng làm filter

  // Extract full date: 15/10/2024 or 10/15/2024
  const dateMatch = lowerPrompt.match(
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/
  );
  if (dateMatch) {
    const [_, d, m, y] = dateMatch;
    const fullYear = y.length === 2 ? `20${y}` : y;
    // Giả sử định dạng ngày tháng là DD/MM/YYYY (D/M/Y)
    dateFilter = `${fullYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    // Thêm các số đã match vào mảng loại bỏ
    wordsToRemoveFromKeywords.push(d, m, y, `${d}/${m}/${y}`, `${d}-${m}-${y}`);
  } else {
    // Extract month: "tháng 10", "month 10", "october", "oct"
    const monthMatch = lowerPrompt.match(/(?:tháng|month)\s*(\d{1,2})/);
    if (monthMatch) {
      monthFilter = monthMatch[1].padStart(2, "0");
      wordsToRemoveFromKeywords.push("tháng", "month", monthMatch[1]);
    } else {
      // English month names
      const monthNames = {
        january: "01",
        jan: "01",
        february: "02",
        feb: "02",
        march: "03",
        mar: "03",
        april: "04",
        apr: "04",
        may: "05",
        june: "06",
        jun: "06",
        july: "07",
        jul: "07",
        august: "08",
        aug: "08",
        september: "09",
        sep: "09",
        sept: "09",
        october: "10",
        oct: "10",
        november: "11",
        nov: "11",
        december: "12",
        dec: "12",
      };

      for (const [name, num] of Object.entries(monthNames)) {
        // Chỉ kiểm tra các tên tháng hoàn chỉnh
        if (lowerPrompt.includes(name)) {
          monthFilter = num;
          wordsToRemoveFromKeywords.push(name);
          // Thêm cả dạng viết tắt nếu dạng đầy đủ được tìm thấy
          const shortName = name.substring(0, 3);
          if (shortName !== name) {
            wordsToRemoveFromKeywords.push(shortName);
          }
          break;
        }
      }
    }

    // Extract year: "năm 2024", "year 2024", "2024"
    // Tìm 4 chữ số (hoặc 2 chữ số) đứng gần 'năm'/'year' hoặc đứng một mình
    const yearMatch = lowerPrompt.match(/(?:năm|year)\s*(\d{4})|(\d{4})/);
    if (yearMatch) {
      const yearStr = yearMatch[1] || yearMatch[2];
      if (yearStr && yearStr.length === 4) {
        yearFilter = yearStr;
        wordsToRemoveFromKeywords.push("năm", "year", yearStr);
      }
    }
  }

  // --- 2. EXTRACT KEYWORDS ---

  // Stop words (Vietnamese + English)
  const stopWords = [
    // Vietnamese
    "tìm",
    "kiếm",
    "cho",
    "tôi",
    "xem",
    "có",
    "những",
    "các",
    "ảnh",
    "hình",
    "album",
    "bộ",
    "của",
    "trong",
    "về",
    "là",
    "mà",
    "và",
    "hay",
    "hoặc",
    "vào",
    "ngày",
    "tháng",
    "năm",
    // English
    "find",
    "search",
    "show",
    "me",
    "get",
    "the",
    "a",
    "an",
    "in",
    "on",
    "at",
    "of",
    "with",
    "from",
    "to",
    "for",
    "by",
    "photo",
    "photos",
    "image",
    "images",
    "picture",
    "pictures",
    "day",
    "month",
    "year",
  ];

  // Extract keywords
  let keywords = lowerPrompt.split(/\s+/).filter((word) => {
    // Loại bỏ:
    // 1. Các từ ngắn (<= 2 ký tự)
    // 2. Các stop words
    // 3. Các số (trừ khi chúng là một phần của từ)
    // 4. Các từ/số đã được dùng làm bộ lọc ngày tháng
    return (
      word.length > 2 &&
      !stopWords.includes(word) &&
      !/^\d+$/.test(word) &&
      !wordsToRemoveFromKeywords.includes(word)
    ); // <-- Điều kiện mới quan trọng
  });

  return { searchType, keywords, dateFilter, monthFilter, yearFilter };
};

/**
 * Tìm kiếm media theo keywords, description, aiTags, date/month/year
 * Logic: AND (phải thỏa mãn TẤT CẢ các điều kiện)
 */
const searchMedia = async (
  userId,
  keywords,
  dateFilter = null,
  monthFilter = null,
  yearFilter = null
) => {
  try {
    const whereClause = { userId };
    const andConditions = [];

    // 1. Search by keywords trong description HOẶC aiTags
    // (Các keywords phải match, nhưng có thể ở description hoặc aiTags)
    if (keywords && keywords.length > 0) {
      keywords.forEach((keyword) => {
        andConditions.push({
          [Op.or]: [
            { description: { [Op.like]: `%${keyword}%` } },
            // Search in aiTags JSON field
            db.Sequelize.where(
              db.Sequelize.fn(
                "JSON_SEARCH",
                db.Sequelize.col("aiTags"),
                "one",
                `%${keyword}%`
              ),
              { [Op.ne]: null }
            ),
          ],
        });
      });
    }

    // 2. Search by exact date (AND với keywords)
    if (dateFilter) {
      andConditions.push({ date: dateFilter });
    }

    // 3. Search by month (AND với keywords)
    if (monthFilter) {
      andConditions.push(
        db.Sequelize.where(
          db.Sequelize.fn("MONTH", db.Sequelize.col("date")),
          parseInt(monthFilter)
        )
      );
    }

    // 4. Search by year (AND với keywords)
    if (yearFilter) {
      andConditions.push(
        db.Sequelize.where(
          db.Sequelize.fn("YEAR", db.Sequelize.col("date")),
          parseInt(yearFilter)
        )
      );
    }

    // Áp dụng tất cả điều kiện với AND logic
    if (andConditions.length > 0) {
      whereClause[Op.and] = andConditions;
    }

    const mediaList = await db.Media.findAll({
      where: whereClause,
      attributes: [
        "id",
        "fileUrl",
        "description",
        "aiTags",
        "date",
        "fileTypeCode",
      ],
      order: [["date", "DESC"]],
      limit: 50,
    });

    return mediaList;
  } catch (error) {
    console.error("Error searching media:", error);
    throw error;
  }
};

/**
 * Tìm kiếm albums theo tên
 */
const searchAlbums = async (userId, keywords) => {
  try {
    const whereClause = { userId };

    if (keywords && keywords.length > 0) {
      const searchConditions = keywords.map((keyword) => ({
        albumName: { [Op.like]: `%${keyword}%` },
      }));

      whereClause[Op.or] = searchConditions;
    }

    const albums = await db.Album.findAll({
      where: whereClause,
      include: [
        {
          model: db.Media,
          attributes: ["id", "fileUrl", "description", "date"],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return albums;
  } catch (error) {
    console.error("Error searching albums:", error);
    throw error;
  }
};

/**
 * Main function: Xử lý câu hỏi chatbot + query database
 */
const processUserQuery = async (userId, prompt) => {
  try {
    // Step 1: Phân tích intent
    const { searchType, keywords, dateFilter, monthFilter, yearFilter } =
      analyzeIntent(prompt);

    console.log("🔍 Intent Analysis:", {
      searchType,
      keywords,
      dateFilter,
      monthFilter,
      yearFilter,
    });

    // Step 2: Query database based on intent
    let results = null;

    if (searchType === "album") {
      results = await searchAlbums(userId, keywords);
    } else if (
      searchType === "media" ||
      searchType === "date" ||
      searchType === "general"
    ) {
      results = await searchMedia(
        userId,
        keywords,
        dateFilter,
        monthFilter,
        yearFilter
      );
    }

    // Step 3: Format results
    const formattedResults = {
      searchType,
      totalResults: results ? results.length : 0,
      data: results,
    };

    return formattedResults;
  } catch (error) {
    console.error("Error processing user query:", error);
    throw error;
  }
};

export default {
  processUserQuery,
  searchMedia,
  searchAlbums,
};
