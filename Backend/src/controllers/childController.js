import childService from "../services/childService.js";
import { startOfWeek, endOfWeek } from "../helpers/weekHelper.js";
const getChildrenByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await childService.getChildrenByUser(userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getChildrenByUser:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

const addChild = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      dob,
      weight,
      height,
      genderCode,
      avatarBase64,
    } = req.body;

    if (!firstName || !lastName || !dob) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required fields (firstName, lastName, dob)",
      });
    }

    const result = await childService.addChild({
      userId,
      firstName,
      lastName,
      dob,
      weight,
      height,
      genderCode,
      avatarBase64,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in addChild:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};
const updateChild = async (req, res) => {
  try {
    const userId = req.user.id;
    const childId = req.params.id;
    const updateData = req.body;

    const result = await childService.updateChild(userId, childId, updateData);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateChild:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

const deleteChild = async (req, res) => {
  try {
    const userId = req.user.id;
    const childId = req.params.id;

    const result = await childService.deleteChild(userId, childId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteChild:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

const getVaccinesByChild = async (req, res) => {
  try {
    const { childId } = req.params;
    if (!childId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing childId parameter",
      });
    }

    const result = await childService.getVaccinesByChild(childId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getVaccinesByChild:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

const updateVaccineDoseStatus = async (req, res) => {
  try {
    const data = req.body;
    const result = await childService.updateVaccineDoseStatus(data);

    if (result.errCode !== 0) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateVaccineDoseStatus controller:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error",
      error: error.message,
    });
  }
};

const getVaccineDosesByVaccine = async (req, res) => {
  try {
    const { childId } = req.params;
    const result = await childService.getVaccineDosesByVaccine(Number(childId));

    if (result.errCode !== 0) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getVaccineDosesByVaccine controller:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error",
      error: error.message,
    });
  }
};

const getVaccineWithDoses = async (req, res) => {
  try {
    const { childId, vaccineId } = req.params;
    const result = await childService.getVaccineWithDoses(
      Number(childId),
      Number(vaccineId)
    );

    if (result.errCode !== 0) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getVaccineWithDoses controller:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error",
      error: error.message,
    });
  }
};

const getChildVaccineDetail = async (req, res) => {
  try {
    const { childId, vaccineId } = req.params;

    if (!childId || !vaccineId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing childId or vaccineId parameter",
      });
    }

    const result = await childService.getChildVaccineDetail(childId, vaccineId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getChildVaccineDetail:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};
const updateChildVaccineStatus = async (req, res) => {
  try {
    const { childId, vaccineId } = req.params;
    const { status, updateTime, note } = req.body;

    if (!childId || !vaccineId || !status) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required fields (childId, vaccineId, status)",
      });
    }

    const result = await childService.updateChildVaccineStatus({
      childId,
      vaccineId,
      status,
      updateTime,
      note,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateChildVaccineStatus:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};
const getInjectedVaccines = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await childService.getInjectedVaccines(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getInjectedVaccines controller:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Server error fetching injected vaccines",
      error: error.message,
    });
  }
};
const getChildHistory = async (req, res) => {
  try {
    const { childId } = req.params;
    const result = await childService.getChildHistory(childId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getChildHistory:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Server error while fetching child history",
    });
  }
};

const createChildHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.params;
    const { date, weight, height } = req.body;

    if (weight == null || height == null) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required fields (weight, height)",
      });
    }

    const result = await childService.createChildHistory(userId, childId, {
      date,
      weight,
      height,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in createChildHistory:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

const updateChildHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, historyId } = req.params;
    const updateData = req.body;

    const result = await childService.updateChildHistory(
      userId,
      childId,
      historyId,
      updateData
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateChildHistory:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

const deleteChildHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, historyId } = req.params;

    const result = await childService.deleteChildHistory(
      userId,
      childId,
      historyId
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteChildHistory:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

const getChildHistoryDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, historyId } = req.params;

    const result = await childService.getChildHistoryDetail(
      userId,
      childId,
      historyId
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getChildHistoryDetail:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};
const getChildMilkLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.params;
    const { date } = req.query; // optional, default: hôm nay

    const result = await childService.getChildMilkLogs(userId, childId, date);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getChildMilkLogs:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

// Tạo milk log mới
const createChildMilkLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.params;
    const { feedingAt, amountMl, sourceCode, moodTags, note } = req.body;

    if (!amountMl || !sourceCode) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required fields (amountMl, sourceCode)",
      });
    }

    const result = await childService.createChildMilkLog(userId, childId, {
      feedingAt,
      amountMl,
      sourceCode,
      moodTags,
      note,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in createChildMilkLog:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

// Cập nhật 1 milk log
const updateChildMilkLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, milkLogId } = req.params;
    const updateData = req.body;

    const result = await childService.updateChildMilkLog(
      userId,
      childId,
      milkLogId,
      updateData
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateChildMilkLog:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

// Xoá 1 milk log
const deleteChildMilkLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, milkLogId } = req.params;

    const result = await childService.deleteChildMilkLog(
      userId,
      childId,
      milkLogId
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteChildMilkLog:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
    });
  }
};

export const createSleep = async (req, res) => {
  try {
    const childId = req.params.childId;
    const log = await childService.createSleepLog(childId, req.body);
    return res.status(201).json(log);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSleepHistory = async (req, res) => {
  try {
    const { childId } = req.params;
    const { from, to } = req.query;

    const logs = await childService.getSleepLogs(childId, from, to);
    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateSleep = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await childService.updateSleepLog(id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Sleep log not found" });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteSleep = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await childService.deleteSleepLog(id);
    if (!result)
      return res.status(404).json({ message: "Sleep log not found" });

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export const getSleepWeek = async (req, res) => {
  try {
    const { childId } = req.params;
    const { week, date } = req.query;

    // Ưu tiên date, nếu có date thì tính tuần theo date
    let targetDate = new Date();

    if (date) {
      targetDate = new Date(date + "T00:00:00");
    } else if (week) {
      // format week: 2025-03-2  => yyyy-mm-weekNumber
      const [year, month, weekNum] = week.split("-");
      targetDate = new Date(year, parseInt(month) - 1, 1 + (weekNum - 1) * 7);
    }

    const from = startOfWeek(targetDate);
    const to = endOfWeek(targetDate);

    const logs = await childService.getSleepLogs(childId, from, to);

    return res.status(200).json({
      weekStart: from,
      weekEnd: to,
      logs,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export default {
  getChildrenByUser,
  addChild,
  updateChild,
  deleteChild,
  getVaccinesByChild,
  getChildVaccineDetail,
  updateChildVaccineStatus,
  getInjectedVaccines,
  getChildHistory,
  createChildHistory,
  updateChildHistory,
  deleteChildHistory,
  getChildHistoryDetail,
  createChildMilkLog,
  deleteChildMilkLog,
  updateChildMilkLog,
  getChildMilkLogs,
  createSleep,
  getSleepHistory,
  updateSleep,
  deleteSleep,
  getSleepWeek,
  updateVaccineDoseStatus,
  getVaccineDosesByVaccine,
  getVaccineWithDoses,
};
