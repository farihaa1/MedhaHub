import { Types } from "mongoose";
import { UserRole } from "../users/user.constants";

export interface ILoginUser {
  email: string;
  password: string;
}
