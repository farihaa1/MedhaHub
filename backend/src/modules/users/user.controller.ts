import { Request, Response } from "express";
import { UserService } from "./user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getSingleUser = async (req: Request, res: Response) => {
  const result = await UserService.getSingleUser(req.params.id as string);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const result = await UserService.updateUser(req.params.id as string, req.body);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
};

