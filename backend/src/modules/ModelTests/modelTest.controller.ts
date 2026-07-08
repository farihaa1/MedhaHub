import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ModelTestService } from "./modelTest.service";

const createModelTest = catchAsync(async (req: Request, res: Response) => {
  const result = await ModelTestService.createModelTest(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Model test created successfully.",
    data: result,
  });
});

const getAllModelTests = catchAsync(async (_req: Request, res: Response) => {
  const result = await ModelTestService.getAllModelTests();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Model tests retrieved successfully.",
    data: result,
  });
});

const getSingleModelTest = catchAsync(async (req: Request, res: Response) => {
  const result = await ModelTestService.getSingleModelTest(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Model test retrieved successfully.",
    data: result,
  });
});

const updateModelTest = catchAsync(async (req: Request, res: Response) => {
  const result = await ModelTestService.updateModelTest(
    req.params.id as string |string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Model test updated successfully.",
    data: result,
  });
});

const deleteModelTest = catchAsync(async (req: Request, res: Response) => {
  await ModelTestService.deleteModelTest(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Model test deleted successfully.",
    data: null,
  });
});

export const ModelTestController = {
  createModelTest,
  getAllModelTests,
  getSingleModelTest,
  updateModelTest,
  deleteModelTest,
};
