import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!(err instanceof multer.MulterError)) {
    return next(err);
  }

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return res.status(400).json({
        success: false,
        message: "Maximum PDF size is 500MB.",
      });

    default:
      return res.status(400).json({
        success: false,
        message: err.message,
      });
  }
};
