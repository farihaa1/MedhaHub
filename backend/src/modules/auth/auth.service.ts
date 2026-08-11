import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserRole, UserStatus } from "../users/user.constants";
import { User } from "../users/user.model";
import { IUser } from "../users/user.interface";

import AppError from "../../error/AppError";
import config from "../../config";

import {
  hashPassword,
  comparePassword,
  generateAuthTokens,
  verifyToken,
} from "./auth.utils";
import { verifyGoogleIdToken } from "./google.utils";
import { AuthProvider } from "./auth.constant";

/* =========================================================
   REGISTER
   Email + Password
========================================================= */

const register = async (payload: IUser) => {
  const existingUser = await User.findOne({
    email: payload.email.toLowerCase(),
  }).select("+password");

  if (existingUser) {
    throw new AppError(409, "Email already exists");
  }

  if (!payload.password) {
    throw new AppError(400, "Password is required for normal registration");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),

    password: hashedPassword,

    avatar: payload.avatar,

    provider: AuthProvider.CREDENTIAL,

    role: UserRole.USER,
    status: UserStatus.ACTIVE,

    isVerified: false,

    points: 0,
  });

  const tokens = generateAuthTokens({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const userObject = user.toObject();

  const { password, ...safeUser } = userObject;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: safeUser,
  };
};

/* =========================================================
   LOGIN
   Email + Password

   IMPORTANT:
   We do NOT check provider here.

   If the user has a password, they can login
   using email + password.

   This means:

   Google account
        +
   later set password
        =
   Google + Password login
========================================================= */

const login = async (payload: { email: string; password: string }) => {
  const user = await User.findOne({
    email: payload.email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (user.status === UserStatus.DELETED) {
    throw new AppError(403, "User account has been deleted");
  }

  /*
   * We don't care whether provider is:
   *
   * credential
   * google
   *
   * If password exists, password login is allowed.
   */

  if (!user.password) {
    throw new AppError(
      400,
      "This account does not have a password. Please login with Google or set a password.",
    );
  }

  const matched = await bcrypt.compare(payload.password, user.password);

  if (!matched) {
    throw new AppError(401, "Incorrect password");
  }

  const tokens = generateAuthTokens({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const userObject = user.toObject();

  const { password, ...safeUser } = userObject;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: safeUser,
  };
};

/* =========================================================
   CHANGE PASSWORD

   Existing password required.
========================================================= */

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (!user.password) {
    throw new AppError(
      400,
      "This account does not have a password. Please use set password.",
    );
  }

  const matched = await comparePassword(oldPassword, user.password);

  if (!matched) {
    throw new AppError(401, "Old password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new AppError(400, "New password must be different from old password");
  }

  if (newPassword.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters long");
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;

  await user.save();

  return null;
};

/* =========================================================
   SET PASSWORD

   Used mainly for Google-only accounts.

   Google account:

   email
   googleId
   password = undefined

   After set password:

   email
   googleId
   password = hashed password

   Now both Google and normal login work.
========================================================= */

const setPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (user.password) {
    throw new AppError(
      400,
      "Password already exists. Please use change password.",
    );
  }

  if (!newPassword || newPassword.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters long.");
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;

  /*
   * If this was a Google-only account,
   * provider can remain GOOGLE.
   *
   * provider represents original registration method.
   *
   * The actual available login methods are determined by:
   *
   * password exists
   * +
   * googleId exists
   */

  await user.save();

  return null;
};

/* =========================================================
   GET ME
========================================================= */

const getMe = async (email: string) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (user.status === UserStatus.DELETED) {
    throw new AppError(403, "User account has been deleted");
  }

  return user;
};

/* =========================================================
   UPDATE PROFILE
========================================================= */

const updateProfile = async (email: string, payload: Partial<IUser>) => {
  /*
   * NEVER allow profile endpoint to change:
   *
   * password
   * email
   * googleId
   * role
   * status
   * provider
   * points
   * isVerified
   */

  const safePayload: Partial<IUser> = {};

  if (payload.name !== undefined) {
    safePayload.name = payload.name;
  }

  if (payload.avatar !== undefined) {
    safePayload.avatar = payload.avatar;
  }

  const user = await User.findOneAndUpdate(
    {
      email: email.toLowerCase(),
    },
    safePayload,
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

/* =========================================================
   REFRESH TOKEN
========================================================= */

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, "Refresh token is required");
  }

  let decoded: JwtPayload;

  try {
    decoded = verifyToken(token, config.jwtRefreshSecret) as JwtPayload;
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  if (!decoded.id) {
    throw new AppError(401, "Invalid refresh token payload");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (user.status === UserStatus.DELETED) {
    throw new AppError(403, "User account has been deleted");
  }

  const tokens = generateAuthTokens({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const userObject = user.toObject();

  const { password, ...safeUser } = userObject;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: safeUser,
  };
};

/* =========================================================
   GOOGLE LOGIN
========================================================= */

const googleLogin = async (idToken: string) => {
  if (!idToken) {
    throw new AppError(400, "Google ID token is required");
  }

  /*
   * Verify token directly with Google.
   *
   * Never trust email/googleId sent by frontend.
   */

  const googleUser = await verifyGoogleIdToken(idToken);

  if (!googleUser.email) {
    throw new AppError(401, "Google account email not found");
  }

  if (!googleUser.emailVerified) {
    throw new AppError(401, "Google email is not verified");
  }

  const email = googleUser.email.toLowerCase();

  /* =====================================================
     STEP 1
     Search by Google ID
  ===================================================== */

  let user = await User.findOne({
    googleId: googleUser.googleId,
  }).select("+password");

  /* =====================================================
     STEP 2
     If Google ID doesn't exist,
     search by email.
  ===================================================== */

  if (!user) {
    user = await User.findOne({
      email,
    }).select("+password");
  }

  /* =====================================================
     EXISTING USER
  ===================================================== */

  if (user) {
    if (user.status === UserStatus.BLOCKED) {
      throw new AppError(403, "User is blocked");
    }

    if (user.status === UserStatus.DELETED) {
      throw new AppError(403, "User account has been deleted");
    }

    /* =================================================
       GOOGLE ID SECURITY CHECK

       If this email is already connected to another
       Google account, reject it.
    ================================================= */

    if (user.googleId && user.googleId !== googleUser.googleId) {
      throw new AppError(
        409,
        "This email is already linked to another Google account.",
      );
    }

    /* =================================================
       LINK GOOGLE TO EXISTING ACCOUNT

       Example:

       Existing credential account:

       email
       password
       googleId = undefined

       User clicks Google login.

       We add googleId.

       Result:

       email
       password
       googleId

       Now both login methods work.
    ================================================= */

    if (!user.googleId) {
      user.googleId = googleUser.googleId;
    }

    /*
     * Update avatar from Google if available.
     */

    if (googleUser.avatar) {
      user.avatar = googleUser.avatar;
    }

    /*
     * Google verified the email.
     */

    user.isVerified = true;

    await user.save();
  }

  /* =====================================================
     NEW GOOGLE USER
  ===================================================== */

  if (!user) {
    user = await User.create({
      name: googleUser.name,
      email,

      googleId: googleUser.googleId,

      avatar: googleUser.avatar,

      /*
       * No password initially.
       *
       * User can later use setPassword().
       */

      provider: AuthProvider.GOOGLE,

      role: UserRole.USER,

      status: UserStatus.ACTIVE,

      isVerified: true,

      points: 0,
    });
  }

  /* =====================================================
     GENERATE NORMAL JWT TOKENS
  ===================================================== */

  const tokens = generateAuthTokens({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const userObject = user.toObject();

  const { password, ...safeUser } = userObject;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: safeUser,
  };
};

/* =========================================================
   EXPORT
========================================================= */

export const AuthService = {
  register,
  login,
  changePassword,
  setPassword,
  getMe,
  updateProfile,
  refreshToken,
  googleLogin,
};
