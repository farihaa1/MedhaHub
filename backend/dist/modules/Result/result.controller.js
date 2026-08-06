"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const result_service_1 = require("./result.service");
const getResult = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await result_service_1.ResultService.getResult(req.params.sessionId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Result retrieved successfully",
        data: result,
    });
});
exports.ResultController = {
    getResult,
};
//# sourceMappingURL=result.controller.js.map