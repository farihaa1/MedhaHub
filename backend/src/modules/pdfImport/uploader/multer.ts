import multer from "multer";
import path from "path";
import httpStatus from "http-status";
import AppError from "../../../error/AppError";
import { storage } from "./storage";

const allowedExtensions = [".pdf"];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new AppError(httpStatus.BAD_REQUEST, "Only PDF files are allowed."),
    );
  }

  cb(null, true);
};

export const uploadPdf = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
    files: 1,
  },
});
