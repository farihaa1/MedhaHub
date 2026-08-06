"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSubmissionService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const questionSubmission_model_1 = require("./questionSubmission.model");
const approval_service_1 = require("./approval.service");
const rejection_service_1 = require("./rejection.service");
const questionSubmission_constant_1 = require("./questionSubmission.constant");
const createSubmission = async (payload, userId) => {
    const submission = await questionSubmission_model_1.QuestionSubmission.create({
        ...payload,
        submittedBy: userId,
    });
    return submission.populate([
        "subjectId",
        "chapterId",
        "topicId",
        "submittedBy",
    ]);
};
/**
 * ---------------------------------------
 * Admin
 * ---------------------------------------
 */
const getAllSubmissions = async (query) => {
    const filter = {};
    if (query.status) {
        filter.status = query.status;
    }
    if (query.submittedBy) {
        filter.submittedBy = query.submittedBy;
    }
    if (query.subjectId) {
        filter.subjectId = query.subjectId;
    }
    if (query.submissionType) {
        filter.submissionType = query.submissionType;
    }
    const submissions = await questionSubmission_model_1.QuestionSubmission.find(filter)
        .populate("subjectId")
        .populate("chapterId")
        .populate("topicId")
        .populate("submittedBy")
        .populate("reviewedBy")
        .populate("approvedQuestionId")
        .sort({
        createdAt: -1,
    });
    return submissions;
};
/**
 * ---------------------------------------
 * User
 * ---------------------------------------
 */
const getMySubmissions = async (userId) => {
    return questionSubmission_model_1.QuestionSubmission.find({
        submittedBy: userId,
    })
        .populate("subjectId")
        .populate("chapterId")
        .populate("topicId")
        .populate("reviewedBy")
        .populate("approvedQuestionId")
        .sort({
        createdAt: -1,
    });
};
/**
 * ---------------------------------------
 * Single
 * ---------------------------------------
 */
const getSingleSubmission = async (id) => {
    const submission = await questionSubmission_model_1.QuestionSubmission.findById(id)
        .populate("subjectId")
        .populate("chapterId")
        .populate("topicId")
        .populate("submittedBy")
        .populate("reviewedBy")
        .populate("approvedQuestionId")
        .populate("existingQuestionId");
    if (!submission) {
        throw new AppError_1.default(404, "Submission not found");
    }
    return submission;
};
/**
 * ---------------------------------------
 * Delete
 * ---------------------------------------
 */
const deleteSubmission = async (id) => {
    const submission = await questionSubmission_model_1.QuestionSubmission.findById(id);
    if (!submission) {
        throw new AppError_1.default(404, "Submission not found");
    }
    if (submission.status === questionSubmission_constant_1.SubmissionStatus.APPROVED) {
        throw new AppError_1.default(400, "Approved submission cannot be deleted");
    }
    await submission.deleteOne();
    return null;
};
exports.QuestionSubmissionService = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
    getSingleSubmission,
    deleteSubmission,
    approveSubmission: approval_service_1.approveSubmission,
    rejectSubmission: rejection_service_1.rejectSubmission,
};
//# sourceMappingURL=questionSubmission.service.js.map