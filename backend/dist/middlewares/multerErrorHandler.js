"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerErrorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const multerErrorHandler = (err, req, res, next) => {
    if (!(err instanceof multer_1.default.MulterError)) {
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
exports.multerErrorHandler = multerErrorHandler;
//# sourceMappingURL=multerErrorHandler.js.map