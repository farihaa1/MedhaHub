"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const statistics_service_1 = require("../services/statistics.service");
const question_model_1 = require("./question.model");
const question_constant_1 = require("./question.constant");
/* =========================================================
   CREATE QUESTION
========================================================= */
const createQuestion = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const question = await question_model_1.Question.create([payload], {
            session,
        });
        /*
         * Only approved questions count publicly.
         */
        if (payload.status === question_constant_1.QuestionStatus.APPROVED) {
            await statistics_service_1.StatisticsService.incrementQuestionCount(payload.chapterId.toString(), 1, session);
            await statistics_service_1.StatisticsService.incrementTopicQuestionCount(payload.topicId.toString(), 1, session);
        }
        await session.commitTransaction();
        return question[0];
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
/* =========================================================
   BULK CREATE QUESTIONS
========================================================= */
const bulkCreateQuestions = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const questions = await question_model_1.Question.insertMany(payload, {
            session,
            ordered: false,
        });
        const chapterMap = new Map();
        const topicMap = new Map();
        /*
         * Only approved questions affect public counts.
         */
        for (const question of payload) {
            if (question.status !== question_constant_1.QuestionStatus.APPROVED) {
                continue;
            }
            const chapterId = question.chapterId.toString();
            const topicId = question.topicId.toString();
            chapterMap.set(chapterId, (chapterMap.get(chapterId) || 0) + 1);
            topicMap.set(topicId, (topicMap.get(topicId) || 0) + 1);
        }
        /* Chapter counts */
        for (const [chapterId, count] of chapterMap) {
            await statistics_service_1.StatisticsService.incrementQuestionCount(chapterId, count, session);
        }
        /* Topic counts */
        for (const [topicId, count] of topicMap) {
            await statistics_service_1.StatisticsService.incrementTopicQuestionCount(topicId, count, session);
        }
        await session.commitTransaction();
        return questions;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
/* =========================================================
   GET ALL QUESTIONS
========================================================= */
const getAllQuestions = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    /* Academic filters */
    if (query.subjectId && query.subjectId !== "all") {
        filter.subjectId = query.subjectId;
    }
    if (query.chapterId && query.chapterId !== "all") {
        filter.chapterId = query.chapterId;
    }
    if (query.topicId && query.topicId !== "all") {
        filter.topicId = query.topicId;
    }
    /* Metadata filters */
    if (query.status && query.status !== "all") {
        filter.status = query.status;
    }
    if (query.difficulty && query.difficulty !== "all") {
        filter.difficulty = query.difficulty;
    }
    if (query.type && query.type !== "all") {
        filter.type = query.type;
    }
    if (query.source && query.source !== "all") {
        filter["sources.type"] = query.source;
    }
    /* Search */
    if (query.searchTerm) {
        filter.questionText = {
            $regex: query.searchTerm,
            $options: "i",
        };
    }
    /* Sorting */
    const sortField = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    const [questions, total] = await Promise.all([
        question_model_1.Question.find(filter)
            .populate("subjectId", "title name")
            .populate("chapterId", "title name")
            .populate("topicId", "title name")
            .sort({
            [sortField]: sortOrder,
        })
            .skip(skip)
            .limit(limit),
        question_model_1.Question.countDocuments(filter),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: questions,
    };
};
/* =========================================================
   GET QUESTIONS BY TOPIC
========================================================= */
const getQuestionsByTopic = async (topicId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(topicId)) {
        throw new AppError_1.default(400, "Invalid topic ID");
    }
    return await question_model_1.Question.find({
        topicId,
        status: question_constant_1.QuestionStatus.APPROVED,
    })
        .populate("subjectId", "title")
        .populate("chapterId", "title")
        .populate("topicId", "title")
        .sort({
        createdAt: -1,
    });
};
/* =========================================================
   GET SINGLE QUESTION
========================================================= */
const getSingleQuestion = async (id) => {
    const question = await question_model_1.Question.findById(id)
        .populate("subjectId", "title")
        .populate("chapterId", "title")
        .populate("topicId", "title");
    if (!question) {
        throw new AppError_1.default(404, "Question not found");
    }
    return question;
};
/* =========================================================
   UPDATE QUESTION
========================================================= */
const updateQuestion = async (id, payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const oldQuestion = await question_model_1.Question.findById(id).session(session);
        if (!oldQuestion) {
            throw new AppError_1.default(404, "Question not found");
        }
        const oldChapterId = oldQuestion.chapterId.toString();
        const oldTopicId = oldQuestion.topicId.toString();
        const oldStatus = oldQuestion.status;
        const newChapterId = payload.chapterId?.toString() || oldChapterId;
        const newTopicId = payload.topicId?.toString() || oldTopicId;
        const newStatus = payload.status || oldStatus;
        const question = await question_model_1.Question.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (!question) {
            throw new AppError_1.default(404, "Question not found");
        }
        const wasApproved = oldStatus === question_constant_1.QuestionStatus.APPROVED;
        const isApproved = newStatus === question_constant_1.QuestionStatus.APPROVED;
        /* =====================================================
           CASE 1:
           Approved → Approved
           ===================================================== */
        if (wasApproved && isApproved) {
            if (oldChapterId !== newChapterId) {
                await statistics_service_1.StatisticsService.decrementQuestionCount(oldChapterId, 1, session);
                await statistics_service_1.StatisticsService.incrementQuestionCount(newChapterId, 1, session);
            }
            if (oldTopicId !== newTopicId) {
                await statistics_service_1.StatisticsService.decrementTopicQuestionCount(oldTopicId, 1, session);
                await statistics_service_1.StatisticsService.incrementTopicQuestionCount(newTopicId, 1, session);
            }
        }
        /* =====================================================
           CASE 2:
           Pending/Rejected → Approved
           ===================================================== */
        if (!wasApproved && isApproved) {
            await statistics_service_1.StatisticsService.incrementQuestionCount(newChapterId, 1, session);
            await statistics_service_1.StatisticsService.incrementTopicQuestionCount(newTopicId, 1, session);
        }
        if (wasApproved && !isApproved) {
            await statistics_service_1.StatisticsService.decrementQuestionCount(oldChapterId, 1, session);
            await statistics_service_1.StatisticsService.decrementTopicQuestionCount(oldTopicId, 1, session);
        }
        await session.commitTransaction();
        return question;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const deleteQuestion = async (id) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        console.log("STEP 1");
        const question = await question_model_1.Question.findById(id).session(session);
        console.log("STEP 2", question);
        if (!question) {
            throw new AppError_1.default(404, "Question not found");
        }
        await question_model_1.Question.findByIdAndDelete(id).session(session);
        if (question.status === question_constant_1.QuestionStatus.APPROVED) {
            if (question.chapterId) {
                await statistics_service_1.StatisticsService.decrementQuestionCount(question.chapterId.toString(), 1, session);
            }
            if (question.topicId) {
                await statistics_service_1.StatisticsService.decrementTopicQuestionCount(question.topicId.toString(), 1, session);
            }
        }
        await session.commitTransaction();
        console.log("STEP 7");
        return question;
    }
    catch (error) {
        console.error(error);
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
/* =========================================================
   QUESTION STATS
========================================================= */
const getQuestionStats = async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const [total, approved, pending, rejected, today] = await Promise.all([
        question_model_1.Question.countDocuments(),
        question_model_1.Question.countDocuments({
            status: question_constant_1.QuestionStatus.APPROVED,
        }),
        question_model_1.Question.countDocuments({
            status: question_constant_1.QuestionStatus.PENDING,
        }),
        question_model_1.Question.countDocuments({
            status: question_constant_1.QuestionStatus.REJECTED,
        }),
        question_model_1.Question.countDocuments({
            createdAt: {
                $gte: startOfToday,
            },
        }),
    ]);
    return {
        total,
        published: approved,
        draft: pending,
        pending,
        rejected,
        premium: 0,
        reported: 0,
        today,
    };
};
exports.QuestionService = {
    createQuestion,
    getAllQuestions,
    getQuestionsByTopic,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
    getQuestionStats,
};
//# sourceMappingURL=question.service.js.map