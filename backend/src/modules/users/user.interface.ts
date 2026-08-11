import { Model } from "mongoose";

import { UserRole, UserStatus } from "./user.constants";
import { AuthProvider } from "../auth/auth.constant";

export interface IUser {
  name: string;
  email: string;

  // Optional because Google-only users initially
  // don't have a password.
  password?: string;

  // Google account identifier
  googleId?: string;

  avatar?: string;

  // Original registration provider
  provider: AuthProvider;

  role: UserRole;
  status: UserStatus;

  isVerified?: boolean;

  points?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Custom static methods available on User model.
 */
export interface IUserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUserDocument | null>;
}

/**
 * Mongoose hydrated document.
 *
 * We intentionally don't use `extends Document`
 * here because modern Mongoose recommends keeping
 * the raw document interface separate.
 */
export type IUserDocument = IUser & {
  _id: import("mongoose").Types.ObjectId;
};
