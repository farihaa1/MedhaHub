import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

import cloudinary from "../../config/cloudinary";

const uploadToCloudinary = (
  file: Express.Multer.File,
  folder = "question-options",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided."));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Image upload failed."));
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const UploadService = {
  uploadToCloudinary,
};
