import { Request, Response } from "express";
import { SubjectService } from "./subject.service";
import { SubjectSlug } from "./subject.constrain";
import { sendResponse } from "../../utils/sendResponse";

const createSubject = async (req: Request, res: Response) => {
  try {
    const result = await SubjectService.createSubject(req.body);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Subject created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to create subject",
      data: error,
    });
  }
};

const getAllSubjects = async (_req: Request, res: Response) => {
  try {
    const result = await SubjectService.getAllSubjects();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subjects retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve subjects",
      data: error,
    });
  }
};

const getSingleSubject = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as SubjectSlug;

    const result = await SubjectService.getSingleSubject(slug);

    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "Subject not found",
        data: null,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subject retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve subject",
      data: error,
    });
  }
};

const updateSubject = async (req: Request, res: Response) => {
  try {
    const result = await SubjectService.updateSubject(
      req.params.slug as SubjectSlug,
      req.body,
    );

    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "Subject not found",
        data: null,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subject updated successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to update subject",
      data: error,
    });
  }
};

const deleteSubject = async (req: Request, res: Response) => {
  try {
    const result = await SubjectService.deleteSubject(
      req.params.slug as SubjectSlug,
    );

    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "Subject not found",
        data: null,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subject deleted successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to delete subject",
      data: error,
    });
  }
};

export const SubjectController = {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
};
