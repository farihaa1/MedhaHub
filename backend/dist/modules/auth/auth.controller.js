"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const auth_utils_1 = require("./auth.utils");
const register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.register(req.body);
    (0, auth_utils_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Registration successful",
        data: result.user,
    });
});
const login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.login(req.body);
    (0, auth_utils_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: result.user,
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await auth_service_1.AuthService.changePassword(req.user.email, oldPassword, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Password changed successfully",
        data: null,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.getMe(req.user.email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User retrieved successfully",
        data: result,
    });
});
const updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.updateProfile(req.user.email, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Profile updated successfully",
        data: result,
    });
});
const refreshToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 401,
            message: "Refresh token missing",
            data: null,
        });
    }
    const result = await auth_service_1.AuthService.refreshToken(refreshToken);
    (0, auth_utils_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Token refreshed",
        data: result.user,
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    (0, auth_utils_1.clearAuthCookies)(res);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});
exports.AuthController = {
    register,
    login,
    changePassword,
    getMe,
    updateProfile,
    refreshToken,
    logout,
};
//# sourceMappingURL=auth.controller.js.map