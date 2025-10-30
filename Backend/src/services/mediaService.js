import fs from "fs";
import path from "path";
import db from "../models/index.js";

const createMedia = async ({ userId, fileBase64, description, date }) => {
  try {
    const base64Data = fileBase64.replace(/^data:.+;base64,/, "");
    const uploadDir = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `media_${Date.now()}_${userId}.jpg`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    const fileUrl = `/uploads/${fileName}`;

    const newMedia = await db.Media.create({
      userId,
      fileUrl,
      description: description || "",
      fileTypeCode: "IMG",
      date: date || new Date().toISOString().split("T")[0],
    });

    return { errCode: 0, message: "Upload success", data: newMedia };
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
      include: [
        {
          model: db.User,
          attributes: ["firstName", "lastName", "email", "image"],
        },
      ],
      order: [["date", "DESC"]],
    });

    return { errCode: 0, data: media };
  } catch (err) {
    console.error("Error fetching media:", err);
    return { errCode: 1, message: "Error fetching media" };
  }
};

export default { createMedia, getAllMediaByUser };
