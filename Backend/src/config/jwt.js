export const jwtConfig = {
  secret: process.env.JWT_SECRET || "default_secret",
  expiresIn: process.env.JWT_EXPIRES || "1h",
};
