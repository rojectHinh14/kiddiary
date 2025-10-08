import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

const salt = bcrypt.genSaltSync(10);

const checkUserEmail = async (userEmail) => {
  try {
    const user = await db.User.findOne({ where: { email: userEmail } });
    return !!user; // true nếu tồn tại, false nếu không
  } catch (error) {
    throw error;
  }
};

const handleUserLogin = async (email, password) => {
  const userData = {};

  try {
    // Check email
    const isExist = await checkUserEmail(email);
    if (!isExist) {
      userData.errCode = 1;
      userData.errMessage = "Email không tồn tại";
      return userData;
    }

    // Lấy thông tin user
    const user = await db.User.findOne({
      attributes: [
        "id",
        "email",
        "roleId",
        "password",
        "firstName",
        "lastName",
        "address",
        "phoneNumber",
        "gender",
        "image",
      ],
      where: { email },
      raw: true,
    });

    if (!user) {
      userData.errCode = 2;
      userData.errMessage = "Không tìm thấy người dùng";
      return userData;
    }

    // Kiểm tra password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      userData.errCode = 3;
      userData.errMessage = "Sai mật khẩu";
      return userData;
    }

    // Xóa password trước khi trả về
    delete user.password;

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.roleId },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    userData.errCode = 0;
    userData.errMessage = "Đăng nhập thành công";
    userData.user = user;
    userData.token = token;

    return userData;
  } catch (error) {
    console.error("Login error:", error);
    return { errCode: -1, errMessage: "Lỗi server" };
  }
};

let handleUserRegister = async (data) => {
  try {
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      return { errCode: 2, errMessage: "Missing required fields" };
    }

    let existingUser = await db.User.findOne({ where: { email: data.email } });
    if (existingUser) {
      return { errCode: 1, errMessage: "Email already registered" };
    }

    let hashPassword = bcrypt.hashSync(data.password, salt);

    let newUser = await db.User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashPassword,
      roleId: "4",
    });

    return { errCode: 0, errMessage: "Register successful", user: newUser };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Server error" };
  }
};

export default { handleUserLogin, handleUserRegister };
