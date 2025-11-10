import db from "../models/index.js";
import path from "path";
import fs from "fs";

const addChild = async (data) => {
  try {
    let avatarUrl = null;

    if (data.avatarBase64 && data.avatarBase64.startsWith("data:image")) {
      const base64Data = data.avatarBase64.replace(/^data:.+;base64,/, "");
      const uploadDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `child_${Date.now()}_${data.userId}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      avatarUrl = `/uploads/${fileName}`;
    }

    const newChild = await db.ChildProfile.create({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      genderCode: data.genderCode,
      avatarUrl,
    });

    //lịch sử tăng trưởng đầu tiên
    if (data.weight && data.height) {
      await db.ChildHistory.create({
        childId: newChild.id,
        weight: data.weight,
        height: data.height,
        date: new Date(),
      });
    }

    // Vaccine
    const vaccines = await db.Vaccine.findAll();
    if (vaccines.length > 0) {
      await db.ChildVaccine.bulkCreate(
        vaccines.map((v) => ({
          childId: newChild.id,
          vaccineId: v.id,
          status: "not_injected",
        }))
      );
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
      include: [
        {
          model: db.ChildHistory,
          as: "histories",
          attributes: ["weight", "height", "date"],
          limit: 1,
          order: [["date", "DESC"]],
        },
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

const updateChild = async (userId, childId, data) => {
  try {
    const child = await db.ChildProfile.findOne({
      where: { id: childId, userId },
    });
    if (!child)
      return { errCode: 1, errMessage: "Child not found or not owned by user" };

    let avatarUrl = child.avatarUrl;
    if (data.avatarBase64 && data.avatarBase64.startsWith("data:image")) {
      const base64Data = data.avatarBase64.replace(/^data:.+;base64,/, "");
      const uploadDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `child_${Date.now()}_${userId}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      avatarUrl = `/uploads/${fileName}`;
    }

    await child.update({
      firstName: data.firstName ?? child.firstName,
      lastName: data.lastName ?? child.lastName,
      dob: data.dob ?? child.dob,
      genderCode: data.genderCode ?? child.genderCode,
      avatarUrl,
    });

    if (data.weight && data.height) {
      await db.ChildHistory.create({
        childId,
        weight: data.weight,
        height: data.height,
        date: new Date(),
      });
    }

    return {
      errCode: 0,
      errMessage: "Child updated successfully",
      data: child,
    };
  } catch (error) {
    console.error("Error in updateChild:", error);
    return { errCode: 2, errMessage: "Error updating child" };
  }
};

const deleteChild = async (userId, childId) => {
  try {
    const child = await db.ChildProfile.findOne({
      where: { id: childId, userId },
    });
    if (!child)
      return { errCode: 1, errMessage: "Child not found or not owned by user" };

    await db.ChildVaccine.destroy({ where: { childId } });
    await db.ChildHistory.destroy({ where: { childId } });
    await db.ChildProfile.destroy({ where: { id: childId } });

    return { errCode: 0, errMessage: "Child deleted successfully" };
  } catch (error) {
    console.error("Error in deleteChild:", error);
    return { errCode: 2, errMessage: "Error deleting child" };
  }
};

const getChildHistory = async (childId) => {
  try {
    const histories = await db.ChildHistory.findAll({
      where: { childId },
      order: [["date", "ASC"]],
      attributes: ["id", "date", "weight", "height", "createdAt"],
    });

    if (!histories || histories.length === 0) {
      return {
        errCode: 1,
        errMessage: "No growth history found for this child",
        data: [],
      };
    }

    return {
      errCode: 0,
      errMessage: "Get child growth history successfully",
      data: histories,
    };
  } catch (error) {
    console.error("Error in getChildHistory:", error);
    return {
      errCode: 2,
      errMessage: "Error fetching child history",
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
const getInjectedVaccines = async (userId) => {
  try {
    const data = await db.ChildVaccine.findAll({
      where: { status: "injected" },
      include: [
        {
          model: db.ChildProfile,
          where: { userId },
          attributes: ["id", "firstName", "lastName", "dob", "genderCode"],
        },
        {
          model: db.Vaccine,
          attributes: [
            "id",
            "vaccineName",
            "vaccinationType",
            "diseaseName",
            "recommendedDate",
          ],
        },
        {
          model: db.AllCode,
          as: "statusData",
          attributes: ["keyMap", "valueVi", "valueEn"],
        },
      ],
      order: [["updateTime", "DESC"]],
    });

    return {
      errCode: 0,
      message: "Get injected vaccines successfully",
      data,
    };
  } catch (error) {
    console.error("Error in getInjectedVaccines service:", error);
    return {
      errCode: 1,
      message: "Error fetching injected vaccines",
      error: error.message,
    };
  }
};
export default {
  addChild,
  getChildrenByUser,
  updateChild,
  deleteChild,
  getVaccinesByChild,
  getChildVaccineDetail,
  updateChildVaccineStatus,
  getInjectedVaccines,
  getChildHistory,
};
