import { Request, Response } from "express";
import httpStatus from "http-status";
import { UploadService } from "./upload.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const uploadImage = catchAsync(async (req: Request, res: Response) => {
   console.log("Upload request received");
  console.log(req.file);
   if (!req.file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "No image uploaded.",
      data: null,
    });
  }

  const result = await UploadService.uploadToCloudinary(
    req.file,
    "question-options",
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image uploaded successfully.",
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    },
  });
});

export const UploadController = {
  uploadImage,
};
