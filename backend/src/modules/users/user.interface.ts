import { Model, Types, HydratedDocument } from "mongoose";
import { UserRole, UserStatus } from "./user.constants";
import { AuthProvider } from "../auth/auth.constant";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;

  role: UserRole;
  status: UserStatus;
  provider: AuthProvider;

  profileImage?: string;
  avatar?: string;
  phone?: string;

  isVerified: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}


export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<HydratedDocument<IUser> | null>;
}
