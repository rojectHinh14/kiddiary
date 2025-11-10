import childService from "../services/childService.js";

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
};
