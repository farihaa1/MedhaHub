"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeSetController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const practiceSet_service_1 = require("./practiceSet.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const createPracticeSet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await practiceSet_service_1.PracticeSetService.createPracticeSet(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Practice set created successfully.",
        data: result,
    });
});
const getAllPracticeSets = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await practiceSet_service_1.PracticeSetService.getAllPracticeSets();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Practice sets retrieved successfully.",
        data: result,
    });
});
const getSinglePracticeSet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await practiceSet_service_1.PracticeSetService.getSinglePracticeSet(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Practice set retrieved successfully.",
        data: result,
    });
});
const updatePracticeSet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await practiceSet_service_1.PracticeSetService.updatePracticeSet(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Practice set updated successfully.",
        data: result,
    });
});
const deletePracticeSet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await practiceSet_service_1.PracticeSetService.deletePracticeSet(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Practice set deleted successfully.",
        data: null,
    });
});
exports.PracticeSetController = {
    createPracticeSet,
    getAllPracticeSets,
    getSinglePracticeSet,
    updatePracticeSet,
    deletePracticeSet,
};
//# sourceMappingURL=practiceSet.controller.js.map