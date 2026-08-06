"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const uploadToCloudinary = (file, folder = "question-options") => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided."));
        }
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Image upload failed."));
            }
            resolve(result);
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
};
exports.UploadService = {
    uploadToCloudinary,
};
//# sourceMappingURL=upload.service.js.map