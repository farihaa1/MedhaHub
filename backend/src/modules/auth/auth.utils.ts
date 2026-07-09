import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IUser } from "../users/user.interface";
import { UserRole } from "../users/user.constants";
import { Response } from "express";
import config from "../../config";

interface TokenPayloadUser {
  _id: IUser["_id"];
  email: string;
  role: UserRole;
}

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {

res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
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
  console.log(hashedPassword);
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate JWT Access Token
 */
export const createToken = (
  payload: object,
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
  return jwt.verify(token, secret) as JwtPayload;
};

/**
 * Generate random token
 * Example: password reset token
 */
export const generateRandomToken = (length = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};
