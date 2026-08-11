import mongoose, { Schema } from "mongoose";

import { IUser, IUserDocument, IUserModel } from "./user.interface";

import { UserRole, UserStatus } from "./user.constants";
import { AuthProvider } from "../auth/auth.constant";

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /**
     * Password is optional because
     * Google users may not have one initially.
     */
    password: {
      type: String,
      required: false,
      select: false,
    },

    /**
     * Google's stable account ID.
     *
     * sparse allows multiple users to have
     * undefined googleId.
     */
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    /**
     * Original registration provider.
     *
     * credential = registered with email/password
     * google     = registered with Google
     */
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Find user by email and explicitly include password.
 *
 * Normally password has select:false.
 */
userSchema.statics.isUserExistsByEmail = function (email: string) {
  return this.findOne({
    email: email.toLowerCase(),
  }).select("+password");
};

/**
 * Prevent OverwriteModelError during development
 * / Next.js-style hot reload environments.
 */
export const User =
  mongoose.models.User || mongoose.model<IUser, IUserModel>("User", userSchema);
