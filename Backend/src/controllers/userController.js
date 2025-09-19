import userService from "../services/userService.js";

let handleLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ errCode: 1, errMessage: "Missing input" });
  }

  let result = await userService.handleUserLogin(email, password);
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

export default { handleLogin, handleRegister };
