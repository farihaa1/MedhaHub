import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Response } from "express";
import { UserRole } from "../users/user.constants";
import config from "../../config";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

interface TokenPayloadUser {
  _id: string;
  email: string;
  role: UserRole;
}

const isProduction = process.env.NODE_ENV === "production";

/**
 * Cookie configuration
 *
 * Production:
 * - httpOnly: prevents JS access
 * - secure: cookie only sent over HTTPS
 * - sameSite: none allows cross-origin frontend/backend requests
 *
 * Development:
 * - secure false because localhost is HTTP
 * - sameSite lax
 */
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/",
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: Number(config.accessCookieMaxAge),
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: Number(config.refreshCookieMaxAge),
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

/**
 * Generate access + refresh token
 */
export const generateAuthTokens = (user: TokenPayloadUser) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    payload,
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn,
  );

  const refreshToken = createToken(
    payload,
    config.jwtRefreshSecret,
    config.jwtRefreshExpiresIn,
  );

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = Number(config.bcryptSaltRounds) || 10;

  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Create JWT
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
 * Verify JWT
 */
export const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
  }
};

/**
 * Generate random token
 */
export const generateRandomToken = (length = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};
