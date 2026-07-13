import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { clearAuthCookies, setAuthCookies } from "./auth.utils";

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: result.user,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result.user,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  await AuthService.changePassword(req.user!.email, oldPassword, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password changed successfully",
    data: null,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user!.email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.updateProfile(req.user!.email, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile updated successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      message: "Refresh token missing",
      data: null,
    });
  }

  const result = await AuthService.refreshToken(refreshToken);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token refreshed",
    data: result.user,
  });
});

const logout = catchAsync(async (_req, res) => {
  clearAuthCookies(res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  changePassword,
  getMe,
  updateProfile,
  refreshToken,
  logout,
};
