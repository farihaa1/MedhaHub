"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_constants_1 = require("../users/user.constants");
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const AuthRoutes = (0, express_1.Router)();
AuthRoutes.post("/register", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.registerValidationSchema), auth_controller_1.AuthController.register);
AuthRoutes.post("/login", auth_controller_1.AuthController.login);
AuthRoutes.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
AuthRoutes.post("/logout", auth_controller_1.AuthController.logout);
AuthRoutes.post("/change-password", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordValidationSchema), auth_controller_1.AuthController.changePassword);
AuthRoutes.get("/me", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), auth_controller_1.AuthController.getMe);
AuthRoutes.patch("/profile", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), auth_controller_1.AuthController.updateProfile);
exports.default = AuthRoutes;
//# sourceMappingURL=auth.route.js.map