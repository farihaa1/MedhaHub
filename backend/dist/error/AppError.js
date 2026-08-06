"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode || 500;
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
//# sourceMappingURL=AppError.js.map