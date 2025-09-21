import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

const salt = bcrypt.genSaltSync(10);

const handleUserLogin = async (email, password) => {
  try {
    let user = await db.User.findOne({
      where: { email },
      raw: true,
    });

    if (!user) {
      return { errCode: 1, errMessage: "User not found" };
    }

    let checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      return { errCode: 2, errMessage: "Wrong password" };
    }

    delete user.password;

    let token = jwt.sign({ id: user.id, email: user.email }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    return {
      errCode: 0,
      errMessage: "Login successful",
      token,
      user,
    };
  } catch (e) {
    console.error("Login error:", e);
    return { errCode: -1, errMessage: "Server error" };
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
    });

    return { errCode: 0, errMessage: "Register successful", user: newUser };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Server error" };
  }
};

export default { handleUserLogin, handleUserRegister };
