import db from "../models/index.js";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = async (email, password) => {
  try {
    let user = await db.User.findOne({
      where: { email: email },
      raw: true,
    });

    if (!user) {
      return { errCode: 1, errMessage: "User not found" };
    }

    let check = bcrypt.compareSync(password, user.password);
    if (!check) {
      return { errCode: 2, errMessage: "Wrong password" };
    }

    return { errCode: 0, errMessage: "Login successful", user };
  } catch (e) {
    console.log(e);
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
