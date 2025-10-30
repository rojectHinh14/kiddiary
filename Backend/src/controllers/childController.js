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
    } = req.body; // Đổi thành avatarBase64

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

export default { getChildrenByUser, addChild };
