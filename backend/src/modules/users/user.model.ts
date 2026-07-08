import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";

import { IUser, UserModel } from "./user.interface";
import { UserRole, UserStatus } from "./user.constants";
import { AuthProvider } from "../auth/auth.constant";

const userSchema = new Schema<IUser, UserModel>(
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

   password: {
  type: String,
  required: function (this: IUser): boolean {
    return this.provider === AuthProvider.CREDENTIAL;
  },
  select: false,
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

    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.CREDENTIAL,
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Remove password after saving
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Static method
userSchema.statics.isUserExistsByEmail = function (email: string) {
  return this.findOne({ email }).select("+password");
};

export const User = model<IUser, UserModel>("User", userSchema);
