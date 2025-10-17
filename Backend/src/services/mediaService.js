import db from "../models/index.js";

const createMedia = async ({ userId, fileBase64, description, date }) => {
  try {
    const newMedia = await db.Media.create({
      userId,
      fileUrl: fileBase64,
      description: description || "",
      fileTypeCode: "IMG",
      date: date || new Date().toISOString().split("T")[0],
    });

    return {
      errCode: 0,
      message: "Upload success",
      data: newMedia,
    };
  } catch (err) {
    console.error("Error in createMedia:", err);
    return {
      errCode: 2,
      message: "Error while creating media",
      error: err.message,
    };
  }
};

const getAllMediaByUser = async (userId) => {
  try {
    const media = await db.Media.findAll({
      where: { userId },
      order: [["date", "DESC"]],
    });
    return { errCode: 0, data: media };
  } catch (err) {
    console.error("Error fetching media:", err);
    return { errCode: 1, message: "Error fetching media" };
  }
};

export default { createMedia, getAllMediaByUser };
