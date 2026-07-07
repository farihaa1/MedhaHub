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

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,

  jwtAccessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
    "15m") as SignOptions["expiresIn"],

  jwtRefreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "7d") as SignOptions["expiresIn"],
};

export default config;
