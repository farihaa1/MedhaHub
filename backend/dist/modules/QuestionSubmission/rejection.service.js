"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectSubmission = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const questionSubmission_model_1 = require("./questionSubmission.model");
const questionSubmission_constant_1 = require("./questionSubmission.constant");
const rejectSubmission = async (submissionId, adminId, reviewComment) => {
    const submission = await questionSubmission_model_1.QuestionSubmission.findById(submissionId);
    if (!submission) {
        throw new AppError_1.default(404, "Submission not found");
    }
    if (submission.status !== questionSubmission_constant_1.SubmissionStatus.PENDING) {
        throw new AppError_1.default(400, "Submission already reviewed");
    }
    submission.status =
        questionSubmission_constant_1.SubmissionStatus.REJECTED;
    submission.reviewedBy =
        adminId;
    submission.reviewedAt =
        new Date();
    submission.reviewComment =
        reviewComment;
    await submission.save();
    return submission;
};
exports.rejectSubmission = rejectSubmission;
//# sourceMappingURL=rejection.service.js.map