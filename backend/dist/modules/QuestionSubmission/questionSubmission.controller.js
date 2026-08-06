"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSubmissionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const questionSubmission_service_1 = require("./questionSubmission.service");
/**
 * ----------------------------------------
 * Create Submission
 * ----------------------------------------
 */
const createSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const result = await questionSubmission_service_1.QuestionSubmissionService.createSubmission(req.body, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Question submitted successfully",
        data: result,
    });
});
/**
 * ----------------------------------------
 * Admin - Get All
 * ----------------------------------------
 */
const getAllSubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionSubmission_service_1.QuestionSubmissionService.getAllSubmissions(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question submissions retrieved successfully",
        data: result,
    });
});
/**
 * ----------------------------------------
 * User - Get My Submissions
 * ----------------------------------------
 */
const getMySubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const result = await questionSubmission_service_1.QuestionSubmissionService.getMySubmissions(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "My submissions retrieved successfully",
        data: result,
    });
});
/**
 * ----------------------------------------
 * Get Single Submission
 * ----------------------------------------
 */
const getSingleSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionSubmission_service_1.QuestionSubmissionService.getSingleSubmission(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question submission retrieved successfully",
        data: result,
    });
});
/**
 * ----------------------------------------
 * Delete Submission
 * ----------------------------------------
 */
const deleteSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await questionSubmission_service_1.QuestionSubmissionService.deleteSubmission(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question submission deleted successfully",
        data: null,
    });
});
/**
 * ----------------------------------------
 * Approve Submission
 * ----------------------------------------
 */
const approve = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user._id;
    const result = await questionSubmission_service_1.QuestionSubmissionService.approveSubmission(req.params.id, adminId, req.body.reviewComment);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question approved successfully",
        data: result,
    });
});
/**
 * ----------------------------------------
 * Reject Submission
 * ----------------------------------------
 */
const reject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminId = req.user._id;
    const result = await questionSubmission_service_1.QuestionSubmissionService.rejectSubmission(req.params.id, adminId, req.body.reviewComment);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question rejected successfully",
        data: result,
    });
});
exports.QuestionSubmissionController = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
    getSingleSubmission,
    deleteSubmission,
    approve,
    reject,
};
//# sourceMappingURL=questionSubmission.controller.js.map