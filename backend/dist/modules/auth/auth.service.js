"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_constants_1 = require("../users/user.constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../users/user.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const auth_utils_1 = require("./auth.utils");
const auth_constant_1 = require("./auth.constant");
const config_1 = __importDefault(require("../../config"));
const register = async (payload) => {
    const existingUser = await user_model_1.User.findOne({
        email: payload.email,
    });
    if (existingUser) {
        throw new AppError_1.default(409, "Email already exists");
    }
    const hashedPassword = await (0, auth_utils_1.hashPassword)(payload.password);
    const user = await user_model_1.User.create({
        ...payload,
        password: hashedPassword,
        role: user_constants_1.UserRole.USER,
        status: user_constants_1.UserStatus.ACTIVE,
        provider: auth_constant_1.AuthProvider.CREDENTIAL,
    });
    const tokens = (0, auth_utils_1.generateAuthTokens)({
        ...user.toObject(),
        _id: user._id.toString(),
    });
    const userObject = user.toObject();
    const { password, ...safeUser } = userObject;
    return {
        ...tokens,
        user: safeUser,
    };
};
const login = async (payload) => {
    const user = await user_model_1.User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status === user_constants_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(403, "User is blocked");
    }
    const matched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!matched) {
        throw new AppError_1.default(401, "Incorrect password");
    }
    const tokens = (0, auth_utils_1.generateAuthTokens)({
        ...user.toObject(),
        _id: user._id.toString(),
    });
    const userObject = user.toObject();
    const { password, ...safeUser } = userObject;
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: safeUser,
    };
};
const changePassword = async (email, oldPassword, newPassword) => {
    const user = await user_model_1.User.isUserExistsByEmail(email);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const matched = await (0, auth_utils_1.comparePassword)(oldPassword, user.password);
    if (!matched) {
        throw new AppError_1.default(401, "Old password is incorrect");
    }
    const hashedPassword = await (0, auth_utils_1.hashPassword)(newPassword);
    await user_model_1.User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
    });
    return null;
};
const getMe = async (email) => {
    const user = await user_model_1.User.findOne({
        email,
    }).select("-password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    return user;
};
const updateProfile = async (email, payload) => {
    const user = await user_model_1.User.findOneAndUpdate({
        email,
    }, payload, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    return user;
};
const refreshToken = async (token) => {
    if (!token) {
        throw new AppError_1.default(401, "Refresh token is required");
    }
    let decoded;
    try {
        decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwtRefreshSecret);
    }
    catch {
        throw new AppError_1.default(401, "Invalid or expired refresh token");
    }
    const user = await user_model_1.User.findById(decoded.id).select("-password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status === user_constants_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(403, "User is blocked");
    }
    const tokens = (0, auth_utils_1.generateAuthTokens)({
        ...user.toObject(),
        _id: user._id.toString(),
    });
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
    };
};
exports.AuthService = {
    register,
    login,
    changePassword,
    getMe,
    updateProfile,
    refreshToken,
};
//# sourceMappingURL=auth.service.js.map