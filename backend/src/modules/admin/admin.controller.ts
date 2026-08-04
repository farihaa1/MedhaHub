import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getDashboard = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getDashboard();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard fetched successfully",
    data: result,
  });
});

export const AdminController = {
  getDashboard,
};
