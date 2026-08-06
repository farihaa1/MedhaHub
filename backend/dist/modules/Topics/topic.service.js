"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const topic_model_1 = require("./topic.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const statistics_service_1 = require("../services/statistics.service");
const question_model_1 = require("../Questions/question.model");
const question_constant_1 = require("../Questions/question.constant");
const createTopic = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const topics = await topic_model_1.Topic.create([payload], { session });
        await statistics_service_1.StatisticsService.incrementTopicCount(payload.chapterId.toString(), 1, session);
        await session.commitTransaction();
        return await topic_model_1.Topic.findById(topics[0]._id)
            .populate("chapterId", "title slug")
            .populate("subjectId", "title slug");
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const getAllTopics = async () => {
    const topics = await topic_model_1.Topic.find()
        .populate({
        path: "chapterId",
        select: "title slug",
    })
        .populate({
        path: "subjectId",
        select: "title slug",
    })
        .sort({ order: 1 })
        .lean();
    return topics;
};
const getSingleTopic = async (id) => {
    const topic = await topic_model_1.Topic.findById(id)
        .populate({
        path: "chapterId",
        select: "title slug",
    })
        .populate({
        path: "subjectId",
        select: "title slug",
    });
    if (!topic) {
        throw new AppError_1.default(404, "Topic not found");
    }
    return topic;
};
const getTopicsByChapter = async (chapterId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(chapterId)) {
        throw new AppError_1.default(400, "Invalid chapter ID");
    }
    return await topic_model_1.Topic.find({
        chapterId,
    })
        .populate({
        path: "chapterId",
        select: "title slug",
    })
        .populate({
        path: "subjectId",
        select: "title slug",
    })
        .sort({
        order: 1,
    })
        .lean();
};
const updateTopic = async (id, payload) => {
    const topic = await topic_model_1.Topic.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })
        .populate({
        path: "chapterId",
        select: "title slug",
    })
        .populate({
        path: "subjectId",
        select: "title slug",
    });
    if (!topic) {
        throw new AppError_1.default(404, "Topic not found");
    }
    return topic;
};
const deleteTopic = async (id) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const topic = await topic_model_1.Topic.findByIdAndDelete(id, {
            session,
        });
        if (!topic) {
            throw new AppError_1.default(404, "Topic not found");
        }
        await statistics_service_1.StatisticsService.decrementTopicCount(topic.chapterId.toString(), 1, session);
        await session.commitTransaction();
        return topic;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const createBulkTopics = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        await topic_model_1.Topic.insertMany(payload, {
            session,
        });
        const chapterMap = new Map();
        payload.forEach((topic) => {
            const id = topic.chapterId.toString();
            chapterMap.set(id, (chapterMap.get(id) || 0) + 1);
        });
        for (const [chapterId, count] of chapterMap) {
            await statistics_service_1.StatisticsService.incrementTopicCount(chapterId, count, session);
        }
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const moveTopic = async (topicId, chapterId) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const topic = await topic_model_1.Topic.findById(topicId).session(session);
        if (!topic) {
            throw new AppError_1.default(404, "Topic not found");
        }
        const oldChapter = topic.chapterId.toString();
        topic.chapterId = new mongoose_1.default.Types.ObjectId(chapterId);
        await topic.save({ session });
        await statistics_service_1.StatisticsService.decrementTopicCount(oldChapter, 1, session);
        await statistics_service_1.StatisticsService.incrementTopicCount(chapterId, 1, session);
        await session.commitTransaction();
        return await topic_model_1.Topic.findById(topicId)
            .populate("chapterId", "title slug")
            .populate("subjectId", "title slug");
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const mergeTopics = async (sourceTopicId, targetTopicId) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const source = await topic_model_1.Topic.findById(sourceTopicId).session(session);
        const target = await topic_model_1.Topic.findById(targetTopicId).session(session);
        if (!source) {
            throw new AppError_1.default(404, "Source topic not found");
        }
        if (!target) {
            throw new AppError_1.default(404, "Target topic not found");
        }
        /*
         * Move questions from source → target
         */
        await question_model_1.Question.updateMany({
            topicId: source._id,
        }, {
            $set: {
                topicId: target._id,
                chapterId: target.chapterId,
                subjectId: target.subjectId,
            },
        }, {
            session,
        });
        /*
         * Recalculate target count
         */
        const targetQuestionCount = await question_model_1.Question.countDocuments({
            topicId: target._id,
            status: question_constant_1.QuestionStatus.APPROVED,
        }).session(session);
        target.totalQuestions = targetQuestionCount;
        await target.save({
            session,
        });
        /*
         * Delete source
         */
        await topic_model_1.Topic.findByIdAndDelete(source._id, {
            session,
        });
        /*
         * Update chapter topic count
         */
        await statistics_service_1.StatisticsService.decrementTopicCount(source.chapterId.toString(), 1, session);
        await session.commitTransaction();
        return await topic_model_1.Topic.findById(target._id)
            .populate("chapterId", "title slug")
            .populate("subjectId", "title slug");
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.TopicService = {
    createTopic,
    getAllTopics,
    getSingleTopic,
    getTopicsByChapter,
    updateTopic,
    deleteTopic,
    createBulkTopics,
    moveTopic,
    mergeTopics,
};
//# sourceMappingURL=topic.service.js.map