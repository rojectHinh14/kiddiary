import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    roleId: user.roleId,
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};
