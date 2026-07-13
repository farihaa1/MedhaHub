import dotenv from "dotenv";
import path from "path";
import { SignOptions } from "jsonwebtoken";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI as string,

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,

  // JWT expires
  jwtAccessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
    "15m") as SignOptions["expiresIn"],

  jwtRefreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "15d") as SignOptions["expiresIn"],

  // Cookie expires (milliseconds)
  accessCookieMaxAge:
    Number(process.env.ACCESS_COOKIE_MAX_AGE) || 15 * 60 * 1000,

  refreshCookieMaxAge:
    Number(process.env.REFRESH_COOKIE_MAX_AGE) || 15 * 24 * 60 * 60 * 1000,
};

export default config;
