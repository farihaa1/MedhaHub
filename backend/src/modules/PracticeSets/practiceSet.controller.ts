import httpStatus from "http-status";
import { Request, Response } from "express";

import { PracticeSetService } from "./practiceSet.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createPracticeSet = catchAsync(async (req: Request, res: Response) => {
  const result = await PracticeSetService.createPracticeSet(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Practice set created successfully.",
    data: result,
  });
});

const getAllPracticeSets = catchAsync(async (_req: Request, res: Response) => {
  const result = await PracticeSetService.getAllPracticeSets();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Practice sets retrieved successfully.",
    data: result,
  });
});

const getSinglePracticeSet = catchAsync(async (req: Request, res: Response) => {
  const result = await PracticeSetService.getSinglePracticeSet(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Practice set retrieved successfully.",
    data: result,
  });
});

const updatePracticeSet = catchAsync(async (req: Request, res: Response) => {
  const result = await PracticeSetService.updatePracticeSet(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Practice set updated successfully.",
    data: result,
  });
});

const deletePracticeSet = catchAsync(async (req: Request, res: Response) => {
  await PracticeSetService.deletePracticeSet(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Practice set deleted successfully.",
    data: null,
  });
});

export const PracticeSetController = {
  createPracticeSet,
  getAllPracticeSets,
  getSinglePracticeSet,
  updatePracticeSet,
  deletePracticeSet,
};
