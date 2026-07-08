import { UserRole, UserStatus } from "../users/user.constants";
import bcrypt from "bcrypt";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import AppError from "../../error/AppError";
import {
  hashPassword,
  comparePassword,
  generateAuthTokens,
  verifyToken,
} from "./auth.utils";
import { AuthProvider } from "./auth.constant";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const register = async (payload: IUser) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new AppError(409, "Email already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    provider: AuthProvider.CREDENTIAL,
  });

  const tokens = generateAuthTokens(user);

  const userObject = user.toObject();

  const { password, ...safeUser } = userObject;

  return {
    ...tokens,
    user: safeUser,
  };
};

const login = async (payload: { email: string; password: string }) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  const matched = await bcrypt.compare(payload.password, user.password);

  if (!matched) {
    throw new AppError(401, "Incorrect password");
  }

  const tokens = generateAuthTokens(user);

  const userObject = user.toObject();

  const { password, ...safeUser } = userObject;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: safeUser,
  };
};

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const matched = await comparePassword(oldPassword, user.password);

  if (!matched) {
    throw new AppError(401, "Old password is incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);

  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });

  return null;
};

const getMe = async (email: string) => {
  const user = await User.findOne({
    email,
  }).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

const updateProfile = async (email: string, payload: Partial<IUser>) => {
  const user = await User.findOneAndUpdate(
    {
      email,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, "Refresh token is required");
  }

  let decoded: JwtPayload;

  try {
    decoded = verifyToken(token,config.jwtRefreshSecret ) as JwtPayload;
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  const tokens = generateAuthTokens(user);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user,
  };
};

export const AuthService = {
  register,
  login,
  changePassword,
  getMe,
  updateProfile,
  refreshToken,
};
