import userService from "../services/userService.js";

let handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ errCode: 1, errMessage: "Missing input" });
  }

  const result = await userService.handleUserLogin(email, password, res);
  return res.status(200).json(result);
};

let handleRegister = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ errCode: 1, errMessage: "Missing input" });
  }

  let result = await userService.handleUserRegister(req.body);
  return res.status(200).json(result);
};
let getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ token decode
    const result = await userService.getUserById(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const result = await userService.updateUser(userId, updateData);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

export default {
  handleLogin,
  handleRegister,
  getUserProfile,
  updateUser,
};
