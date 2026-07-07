import { UserRole, UserStatus } from "../users/user.constants";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import AppError from "../../error/AppError";
import { hashPassword, comparePassword, generateAuthTokens } from "./auth.utils";
import { AuthProvider } from "./auth.constant";


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

  const matched = await comparePassword(payload.password, user.password);

  if (!matched) {
    throw new AppError(401, "Incorrect password");
  }

  const tokens = generateAuthTokens(user);
  const userObject = user.toObject();

  const { password, ...safeUser } = userObject;

  return {
    ...tokens,
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

export const AuthService = {
  register,
  login,
  changePassword,
  getMe,
  updateProfile,
};
