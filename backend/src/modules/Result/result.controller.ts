import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";

import { ResultService } from "./result.service";

const getResult = catchAsync(async (req: Request, res: Response) => {
  const result = await ResultService.getResult(req.params.sessionId as string);

  sendResponse(res, {
    success: true,

    statusCode: 200,

    message: "Result retrieved successfully",

    data: result,
  });
});

export const ResultController = {
  getResult,
};
