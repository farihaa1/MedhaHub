import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { clearAuthCookies, setAuthCookies } from "./auth.utils";
import AppError from "../../error/AppError";

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
const setPassword = catchAsync(async (req: Request, res: Response) => {
  const { newPassword } = req.body;

  await AuthService.setPassword(req.user!.email, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password set successfully",
    data: null,
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
  if (!req.user?.email) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Authentication information is missing.",
    );
  }

  const result = await AuthService.getMe(req.user.email);
  console.log(result);
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
const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  const result = await AuthService.googleLogin(idToken);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Google login successful",
    data: result.user,
  });
});

export const AuthController = {
  register,
  login,
  googleLogin,
  changePassword,
  setPassword,
  getMe,
  updateProfile,
  refreshToken,
  logout,
};