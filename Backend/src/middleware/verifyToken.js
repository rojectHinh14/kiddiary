import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ code: "NO_TOKEN", message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.user = payload; 
    return next();
  } catch (e) {
    return res.status(401).json({ code: "TOKEN_EXPIRED", message: "Unauthorized" });
  }
}
