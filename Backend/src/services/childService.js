import db from "../models/index.js";
import path from "path";
import fs from "fs";

const addChild = async (data) => {
  try {
    let avatarUrl = null;

    if (data.avatarBase64 && data.avatarBase64.startsWith("data:image")) {
      const base64Data = data.avatarBase64.replace(/^data:.+;base64,/, "");
      const uploadDir = path.join(__dirname, "../../uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `child_${Date.now()}_${data.userId}.jpg`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      avatarUrl = `/uploads/${fileName}`;
    }

    // ✅ Tạo bản ghi trong DB
    const newChild = await db.ChildProfile.create({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      weight: data.weight,
      height: data.height,
      genderCode: data.genderCode,
      avatarUrl, // nếu có
    });

    return {
      errCode: 0,
      errMessage: "Child added successfully",
      data: newChild,
    };
  } catch (error) {
    console.error("Error in addChild:", error);
    return {
      errCode: 1,
      errMessage: "Error adding child",
      error: error.message,
    };
  }
};

const getChildrenByUser = async (userId) => {
  try {
    const children = await db.ChildProfile.findAll({
      where: { userId },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "dob",
        "weight",
        "height",
        "genderCode",
        "avatarUrl",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      errCode: 0,
      errMessage: "Get children successfully",
      data: children,
    };
  } catch (error) {
    console.error("Error in getChildrenByUser:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching children",
      error: error.message,
    };
  }
};

export default {
  addChild,
  getChildrenByUser,
};
