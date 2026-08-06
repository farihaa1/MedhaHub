"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicController = void 0;
const topic_service_1 = require("./topic.service");
const sendResponse_1 = require("../../utils/sendResponse");
const topic_model_1 = require("./topic.model");
const createTopic = async (req, res) => {
    const result = await topic_service_1.TopicService.createTopic(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Topic created successfully",
        data: result,
    });
};
const getAllTopics = async (_req, res) => {
    const result = await topic_service_1.TopicService.getAllTopics();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topics retrieved successfully",
        data: result,
    });
};
const getSingleTopic = async (req, res) => {
    const result = await topic_service_1.TopicService.getSingleTopic(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topic retrieved successfully",
        data: result,
    });
};
const getTopicsByChapter = async (req, res) => {
    const result = await topic_service_1.TopicService.getTopicsByChapter(req.params.chapterId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topics retrieved successfully",
        data: result,
    });
};
const updateTopic = async (req, res) => {
    const result = await topic_service_1.TopicService.updateTopic(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topic updated successfully",
        data: result,
    });
};
const deleteTopic = async (req, res) => {
    const result = await topic_service_1.TopicService.deleteTopic(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topic deleted successfully",
        data: result,
    });
};
const deleteAllTopic = async () => {
    return await topic_model_1.Topic.deleteMany({});
};
const createBulkTopics = async (req, res) => {
    const result = await topic_service_1.TopicService.createBulkTopics(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Topics created successfully",
        data: result,
    });
};
const moveTopic = async (req, res) => {
    const { chapterId } = req.body;
    const result = await topic_service_1.TopicService.moveTopic(req.params.id, chapterId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topic moved successfully",
        data: result,
    });
};
const mergeTopics = async (req, res) => {
    const { sourceTopicId, targetTopicId } = req.body;
    const result = await topic_service_1.TopicService.mergeTopics(sourceTopicId, targetTopicId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Topics merged successfully",
        data: result,
    });
};
exports.TopicController = {
    createTopic,
    getAllTopics,
    getSingleTopic,
    getTopicsByChapter,
    updateTopic,
    deleteTopic,
    deleteAllTopic,
    createBulkTopics,
    moveTopic,
    mergeTopics,
};
//# sourceMappingURL=topic.controller.js.map