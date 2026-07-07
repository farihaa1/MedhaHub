import { Request, Response } from "express";
import { ChapterService } from "./chapter.service";
import { sendResponse } from "../../utils/sendResponse";

const createChapter = async (req: Request, res: Response) => {
  try {
    const result = await ChapterService.createChapter(req.body);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Chapter created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to create chapter",
      data: error,
    });
  }
};

const getAllChapters = async (_req: Request, res: Response) => {
  try {
    const result = await ChapterService.getAllChapters();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Chapters retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve chapters",
      data: error,
    });
  }
};

const getSingleChapter = async (req: Request, res: Response) => {
  try {
    const result = await ChapterService.getSingleChapter(req.params.id as string);

    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "Chapter not found",
        data:undefined
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Chapter retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve chapter",
      data: error,
    });
  }
};
const getChaptersBySubject = async (req: Request, res: Response) => {
  try {
    const result = await ChapterService.getChaptersBySubject(
      req.params.subjectId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Chapters retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve chapters",
      data: error,
    });
  }
};

const updateChapter = async (req: Request, res: Response) => {
  try {
    const result = await ChapterService.updateChapter(req.params.id as string, req.body);

    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "Chapter not found",
        data: undefined,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Chapter updated successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to update chapter",
      data: error,
    });
  }
};

const deleteChapter = async (req: Request, res: Response) => {
  try {
    const result = await ChapterService.deleteChapter(req.params.id as string);

    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "Chapter not found",
        data: undefined,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Chapter deleted successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to delete chapter",
      data: error,
    });
  }
};

export const ChapterController = {
  createChapter,
  getAllChapters,
  getSingleChapter,
  updateChapter,
  deleteChapter,
  getChaptersBySubject,
};
