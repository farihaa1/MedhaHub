"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const question_service_1 = require("./question.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const createQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.createQuestion(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Question created successfully",
        data: result,
    });
});
const bulkCreateQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.bulkCreateQuestions(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Questions created successfully",
        data: result,
    });
});
const getAllQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log("Query from get alla questions:", req.query);
    const result = await question_service_1.QuestionService.getAllQuestions(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Questions retrieved successfully",
        data: result,
    });
});
const getQuestionsByTopic = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.getQuestionsByTopic(req.params.topicId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topic questions retrieved",
        data: result,
    });
});
const getSingleQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.getSingleQuestion(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question retrieved",
        data: result,
    });
});
const updateQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.updateQuestion(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question updated",
        data: result,
    });
});
const deleteQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await question_service_1.QuestionService.deleteQuestion(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question deleted",
        data: result,
    });
});
const getQuestionStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await question_service_1.QuestionService.getQuestionStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Question statistics retrieved successfully",
        data: result,
    });
});
exports.QuestionController = {
    createQuestion,
    getAllQuestions,
    getQuestionsByTopic,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
    getQuestionStats
};
//# sourceMappingURL=question.controller.js.map