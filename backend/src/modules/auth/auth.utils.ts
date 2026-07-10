import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IUser } from "../users/user.interface";
import { UserRole } from "../users/user.constants";
import { Response } from "express";
import config from "../../config";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

interface TokenPayloadUser {
  _id: IUser["_id"];
  email: string;
  role: UserRole;
}
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: config.nodeEnv === "production" ? "none" : "lax",
  path: "/",
} as const;
export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: SEVEN_DAYS,
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

export const generateAuthTokens = (user: TokenPayloadUser) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: createToken(
      payload,
      config.jwtAccessSecret,
      config.jwtAccessExpiresIn,
    ),
    refreshToken: createToken(
      payload,
      config.jwtRefreshSecret,
      config.jwtRefreshExpiresIn,
    ),
  };
};

/**
 * Hash password before saving
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = Number(config.bcryptSaltRounds) || 10;

  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain password with hashed password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate JWT Access Token
 */
export const createToken = (
  payload: JwtPayload | Record<string, unknown>,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
};

/**
 * Generate random token
 * Example: password reset token
 */
export const generateRandomToken = (length = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};
