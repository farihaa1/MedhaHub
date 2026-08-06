"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelTestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const modelTest_service_1 = require("./modelTest.service");
const createModelTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await modelTest_service_1.ModelTestService.createModelTest(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Model test created successfully.",
        data: result,
    });
});
const getAllModelTests = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await modelTest_service_1.ModelTestService.getAllModelTests();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Model tests retrieved successfully.",
        data: result,
    });
});
const getSingleModelTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await modelTest_service_1.ModelTestService.getSingleModelTest(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Model test retrieved successfully.",
        data: result,
    });
});
const updateModelTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await modelTest_service_1.ModelTestService.updateModelTest(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Model test updated successfully.",
        data: result,
    });
});
const deleteModelTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await modelTest_service_1.ModelTestService.deleteModelTest(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Model test deleted successfully.",
        data: null,
    });
});
exports.ModelTestController = {
    createModelTest,
    getAllModelTests,
    getSingleModelTest,
    updateModelTest,
    deleteModelTest,
};
//# sourceMappingURL=modelTest.controller.js.map