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

    const vaccines = await db.Vaccine.findAll();
    if (!vaccines || vaccines.length === 0) {
      console.warn("⚠️ No vaccine found. Please seed the Vaccine table first.");
    } else {
      const childVaccines = vaccines.map((vaccine) => ({
        childId: newChild.id,
        vaccineId: vaccine.id,
        status: "not_injected", // default
      }));

      await db.ChildVaccine.bulkCreate(childVaccines);
    }

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

const getVaccinesByChild = async (childId) => {
  try {
    const vaccines = await db.ChildVaccine.findAll({
      where: { childId },
      include: [
        {
          model: db.Vaccine,
          attributes: [
            "id",
            "vaccineName",
            "vaccinationType",
            "diseaseName",
            "description",
          ],
        },
        {
          model: db.AllCode,
          as: "statusData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
      ],
      attributes: ["id", "status", "updateTime", "note"],
      order: [[db.Vaccine, "id", "ASC"]],
    });

    if (!vaccines || vaccines.length === 0) {
      return {
        errCode: 0,
        errMessage: "No vaccines found for this child",
        data: [],
      };
    }

    return {
      errCode: 0,
      errMessage: "Get child vaccines successfully",
      data: vaccines,
    };
  } catch (error) {
    console.error("Error in getVaccinesByChild:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching child vaccines",
      error: error.message,
    };
  }
};
const getChildVaccineDetail = async (childId, vaccineId) => {
  try {
    const record = await db.ChildVaccine.findOne({
      where: { childId, vaccineId },
      include: [
        {
          model: db.Vaccine,
          attributes: [
            "id",
            "vaccineName",
            "vaccinationType",
            "diseaseName",
            "description",
            "about",
            "required",
            "recommendedDate",
            "symptoms",
          ],
        },
        {
          model: db.AllCode,
          as: "statusData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
      ],
      attributes: [
        "id",
        "childId",
        "vaccineId",
        "status",
        "updateTime",
        "note",
      ],
    });

    if (!record) {
      return {
        errCode: 1,
        errMessage: "No vaccine found for this childId and vaccineId",
      };
    }

    return {
      errCode: 0,
      errMessage: "Get child vaccine detail successfully",
      data: record,
    };
  } catch (error) {
    console.error("Error in getChildVaccineDetail:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching child vaccine detail",
      error: error.message,
    };
  }
};

const updateChildVaccineStatus = async (data) => {
  try {
    const { childId, vaccineId, status, updateTime, note } = data;

    const validStatus = await db.AllCode.findOne({
      where: { keyMap: status, type: "VACCINE_STATUS" },
    });

    if (!validStatus) {
      return {
        errCode: 2,
        errMessage: `Invalid vaccine status: ${status}`,
      };
    }

    const record = await db.ChildVaccine.findOne({
      where: { childId, vaccineId },
    });

    if (!record) {
      return {
        errCode: 1,
        errMessage: "Vaccine record not found for this child",
      };
    }

    record.status = status;
    record.updateTime = updateTime || new Date();
    if (note !== undefined) record.note = note;

    await record.save();

    return {
      errCode: 0,
      errMessage: "Update vaccine status successfully",
      data: record,
    };
  } catch (error) {
    console.error("Error in updateChildVaccineStatus:", error);
    return {
      errCode: 1,
      errMessage: "Error updating vaccine status",
      error: error.message,
    };
  }
};

export default {
  addChild,
  getChildrenByUser,
  getVaccinesByChild,
  getChildVaccineDetail,
  updateChildVaccineStatus,
};
