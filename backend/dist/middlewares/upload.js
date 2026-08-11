"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// ============================================================
// FILE FILTER
// ============================================================
const fileFilter = (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
};
// ============================================================
// MULTER
// ============================================================
//
// IMPORTANT:
// Cloudinary service uses file.buffer.
// Therefore memoryStorage() is required.
// ============================================================
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
exports.default = exports.upload;
//# sourceMappingURL=upload.js.map