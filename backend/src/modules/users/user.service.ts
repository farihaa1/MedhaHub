import { User } from "./user.model";

const getAllUsers = async () => {
  return await User.find().select("-password");
};

const getSingleUser = async (id: string) => {
  return await User.findById(id).select("-password");
};

const updateUser = async (id: string, payload: any) => {
  return await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("-password");
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
};
