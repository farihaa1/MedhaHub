"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const upload_service_1 = require("./upload.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const uploadImage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log("Upload request received");
    console.log(req.file);
    if (!req.file) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "No image uploaded.",
            data: null,
        });
    }
    const result = await upload_service_1.UploadService.uploadToCloudinary(req.file, "question-options");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
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
exports.UploadController = {
    uploadImage,
};
//# sourceMappingURL=upload.controller.js.map