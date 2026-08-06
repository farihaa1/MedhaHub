"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomToken = exports.verifyToken = exports.createToken = exports.comparePassword = exports.hashPassword = exports.generateAuthTokens = exports.clearAuthCookies = exports.setAuthCookies = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const cookieOptions = {
    httpOnly: true,
    secure: config_1.default.nodeEnv === "production",
    sameSite: config_1.default.nodeEnv === "production" ? "none" : "lax",
    path: "/",
};
const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: config_1.default.accessCookieMaxAge,
    });
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: config_1.default.refreshCookieMaxAge,
    });
};
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
};
exports.clearAuthCookies = clearAuthCookies;
const generateAuthTokens = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    return {
        accessToken: (0, exports.createToken)(payload, config_1.default.jwtAccessSecret, config_1.default.jwtAccessExpiresIn),
        refreshToken: (0, exports.createToken)(payload, config_1.default.jwtRefreshSecret, config_1.default.jwtRefreshExpiresIn),
    };
};
exports.generateAuthTokens = generateAuthTokens;
/**
 * Hash password before saving
 */
const hashPassword = async (password) => {
    const saltRounds = Number(config_1.default.bcryptSaltRounds) || 10;
    return await bcrypt_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
/**
 * Compare plain password with hashed password
 */
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
/**
 * Generate JWT Access Token
 */
const createToken = (payload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn,
    });
};
exports.createToken = createToken;
/**
 * Verify JWT Token
 */
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token");
    }
};
exports.verifyToken = verifyToken;
/**
 * Generate random token
 * Example: password reset token
 */
const generateRandomToken = (length = 32) => {
    return crypto_1.default.randomBytes(length).toString("hex");
};
exports.generateRandomToken = generateRandomToken;
//# sourceMappingURL=auth.utils.js.map