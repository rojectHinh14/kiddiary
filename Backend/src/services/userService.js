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

const handleUserLogin = async (email, password, res) => {
  const userData = {};

  try {
    const isExist = await checkUserEmail(email);
    if (!isExist) {
      return { errCode: 1, errMessage: "Email không tồn tại" };
    }

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
      return { errCode: 2, errMessage: "Không tìm thấy người dùng" };
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return { errCode: 3, errMessage: "Sai mật khẩu" };
    }

    delete user.password;

    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.roleId },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    //Set cookie HttpOnly
    res.cookie("token", token, {
      httpOnly: true, // JS không đọc được
      secure: false, // true nếu deploy HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1h
    });

    return {
      errCode: 0,
      errMessage: "Đăng nhập thành công",
      user,
    };
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
      roleId: "R4",
    });

    return { errCode: 0, errMessage: "Register successful", user: newUser };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Server error" };
  }
};

export default { handleUserLogin, handleUserRegister };
