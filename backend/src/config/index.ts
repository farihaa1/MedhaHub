import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES: process.env.JWT_EXPIRES || "7d",
  REFRESH_SECRET: process.env.REFRESH_SECRET as string,
  REFRESH_EXPIRES: process.env.REFRESH_EXPIRES || "30d",
};
