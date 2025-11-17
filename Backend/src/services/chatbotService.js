import db from "../models/index.js";
import { Op } from "sequelize";

/**
 * Phân tích intent từ câu hỏi tiếng Việt
 * Trả về: { searchType, keywords, dateFilter }
 */
const analyzeIntent = (prompt) => {
  const lowerPrompt = prompt.toLowerCase().trim();
  
  // Detect search type
  let searchType = "general"; // general, album, media, date
  
  if (lowerPrompt.includes("album") || lowerPrompt.includes("bộ ảnh")) {
    searchType = "album";
  } else if (
    lowerPrompt.includes("ảnh") ||
    lowerPrompt.includes("hình") ||
    lowerPrompt.includes("photo")
  ) {
    searchType = "media";
  } else if (
    lowerPrompt.includes("ngày") ||
    lowerPrompt.includes("tháng") ||
    lowerPrompt.includes("năm") ||
    /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(lowerPrompt)
  ) {
    searchType = "date";
  }

  // Extract keywords (remove common words và date-related words)
  const stopWords = [
    "tìm", "kiếm", "cho", "tôi", "xem", "có", "những", "các", "ảnh", "hình",
    "album", "bộ", "của", "trong", "về", "là", "mà", "và", "hay", "hoặc",
    "vào", "ngày", "tháng", "năm"
  ];
  
  let keywords = lowerPrompt
    .split(/\s+/)
    .filter((word) => {
      // Loại bỏ stop words và số (vì số thường là tháng/năm)
      return word.length > 1 && !stopWords.includes(word) && !/^\d+$/.test(word);
    });

  // Extract date/month/year filter
  let dateFilter = null;
  let monthFilter = null;
  let yearFilter = null;

  // Extract full date: 15/10/2024 hoặc 15-10-2024
  const dateMatch = lowerPrompt.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dateMatch) {
    const [_, day, month, year] = dateMatch;
    const fullYear = year.length === 2 ? `20${year}` : year;
    dateFilter = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  } else {
    // Extract month only: "tháng 10", "tháng 3"
    const monthMatch = lowerPrompt.match(/tháng\s*(\d{1,2})/);
    if (monthMatch) {
      monthFilter = monthMatch[1].padStart(2, "0");
    }

    // Extract year: "năm 2024", "2024"
    const yearMatch = lowerPrompt.match(/năm\s*(\d{4})|(\d{4})/);
    if (yearMatch) {
      yearFilter = yearMatch[1] || yearMatch[2];
    }
  }

  return { searchType, keywords, dateFilter, monthFilter, yearFilter };
};

/**
 * Tìm kiếm media theo keywords, description, aiTags, date/month/year
 * Logic: AND (phải thỏa mãn TẤT CẢ các điều kiện)
 */
const searchMedia = async (userId, keywords, dateFilter = null, monthFilter = null, yearFilter = null) => {
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
              db.Sequelize.fn("JSON_SEARCH", db.Sequelize.col("aiTags"), "one", `%${keyword}%`),
              { [Op.ne]: null }
            )
          ]
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
      attributes: ["id", "fileUrl", "description", "aiTags", "date", "fileTypeCode"],
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
    const { searchType, keywords, dateFilter, monthFilter, yearFilter } = analyzeIntent(prompt);

    console.log("🔍 Intent Analysis:", { searchType, keywords, dateFilter, monthFilter, yearFilter });

    // Step 2: Query database based on intent
    let results = null;

    if (searchType === "album") {
      results = await searchAlbums(userId, keywords);
    } else if (searchType === "media" || searchType === "date" || searchType === "general") {
      results = await searchMedia(userId, keywords, dateFilter, monthFilter, yearFilter);
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