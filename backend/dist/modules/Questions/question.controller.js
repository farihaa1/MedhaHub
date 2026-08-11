"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const question_service_1 = require("./question.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const user_constants_1 = require("../users/user.constants");
const question_constant_1 = require("./question.constant");
/* =========================================================
   CREATE QUESTION
========================================================= */
const createQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = {
        ...req.body,
        createdBy: req.user.id,
        /*
         * Backend decides status.
         *
         * ADMIN -> APPROVED
         * USER  -> PENDING
         */
        status: req.user.role === user_constants_1.UserRole.ADMIN
            ? question_constant_1.QuestionStatus.APPROVED
            : question_constant_1.QuestionStatus.PENDING,
    };
    const result = await question_service_1.QuestionService.createQuestion(payload, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Question created successfully",
        data: result,
    });
});
const bulkCreateQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const status = req.user.role === user_constants_1.UserRole.ADMIN
        ? question_constant_1.QuestionStatus.APPROVED
        : question_constant_1.QuestionStatus.PENDING;
    const payload = req.body.map((question) => ({
        ...question,
        createdBy: req.user.id,
        status,
    }));
    const result = await question_service_1.QuestionService.bulkCreateQuestions(payload, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Questions created successfully",
        data: result,
    });
});
/* =========================================================
   GET ALL QUESTIONS
========================================================= */
const getAllQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.getAllQuestions(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Questions retrieved successfully",
        data: result,
    });
});
/* =========================================================
   GET QUESTIONS BY TOPIC
========================================================= */
const getQuestionsByTopic = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.getQuestionsByTopic(req.params.topicId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topic questions retrieved",
        data: result,
    });
});
/* =========================================================
   GET SINGLE QUESTION
========================================================= */
const getSingleQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.getSingleQuestion(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question retrieved",
        data: result,
    });
});
/* =========================================================
   UPDATE QUESTION
========================================================= */
const updateQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.updateQuestion(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question updated",
        data: result,
    });
});
/* =========================================================
   DELETE QUESTION
========================================================= */
const deleteQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.deleteQuestion(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question deleted",
        data: result,
    });
});
/* =========================================================
   QUESTION STATISTICS
========================================================= */
const getQuestionStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await question_service_1.QuestionService.getQuestionStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question statistics retrieved successfully",
        data: result,
    });
});
/* =========================================================
   EXPORT
========================================================= */
exports.QuestionController = {
    createQuestion,
    getAllQuestions,
    getQuestionsByTopic,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
    getQuestionStats,
};
//# sourceMappingURL=question.controller.js.map