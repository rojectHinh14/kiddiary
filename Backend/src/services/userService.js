import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";
import path from "path";
import fs from "fs";

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

const getUserById = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return { errCode: 1, message: "User not found" };
    }

    return {
      errCode: 0,
      message: "Get user info successfully",
      data: user,
    };
  } catch (err) {
    console.error("Error in getUserById:", err);
    return { errCode: 1, message: "Error getting user info" };
  }
};

const updateUser = async (userId, updateData) => {
  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return { errCode: 1, message: "User not found" };
    }

    // Xử lý nếu có ảnh base64
    if (updateData.image && updateData.image.startsWith("data:image")) {
      const base64Data = updateData.image.replace(/^data:.+;base64,/, "");

      const uploadDir = path.join(__dirname, "../../uploads/avatars");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `avatar_${userId}_${Date.now()}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

      updateData.image = `/uploads/avatars/${fileName}`;
    }

    if (updateData.password) {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(updateData.password, salt);
    }

    await db.User.update(updateData, { where: { id: userId } });

    return { errCode: 0, message: "User updated successfully" };
  } catch (err) {
    console.error("Error in updateUser:", err);
    return { errCode: 2, message: "Error updating user", error: err.message };
  }
};



export default { handleUserLogin, handleUserRegister, getUserById, updateUser };
