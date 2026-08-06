"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(process.cwd(), ".env"),
});
const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGO_URI,
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    // JWT expires
    jwtAccessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
        "30m"),
    jwtRefreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
        "15d"),
    // Cookie expires (milliseconds)
    accessCookieMaxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE) || 15 * 60 * 1000,
    refreshCookieMaxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 15 * 24 * 60 * 60 * 1000,
    // Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
};
exports.default = config;
//# sourceMappingURL=index.js.map