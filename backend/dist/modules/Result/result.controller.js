"use strict";
// modules/Result/result.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const result_service_1 = require("./result.service");
const getResultReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Authentication required.");
    }
    const result = await result_service_1.ResultService.getResultReview(req.params.sessionId, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Result retrieved successfully.",
        data: result,
    });
});
exports.ResultController = {
    getResultReview,
};
//# sourceMappingURL=result.controller.js.map