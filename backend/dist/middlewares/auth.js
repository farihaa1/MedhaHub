"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../error/AppError"));
const user_model_1 = require("../modules/users/user.model");
const auth = (...requiredRoles) => async (req, _res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            throw new AppError_1.default(401, "You are not authorized");
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        const user = await user_model_1.User.findById(decoded.id);
        if (!user) {
            throw new AppError_1.default(404, "User not found");
        }
        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
            throw new AppError_1.default(403, "Forbidden");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map