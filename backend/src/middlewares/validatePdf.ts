import { RequestHandler } from "express";
import httpStatus from "http-status";

const validatePdf: RequestHandler = (req, res, next) => {
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "PDF file is required.",
    });
  }

  if (req.file.mimetype !== "application/pdf") {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Invalid PDF file.",
    });
  }

  next();
};

export default validatePdf;
