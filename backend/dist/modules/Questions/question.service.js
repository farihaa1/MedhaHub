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
const user_constants_1 = require("../users/user.constants");
const question_utils_1 = require("./question.utils");
// =========================================================
// CATEGORY ORDER
// =========================================================
const CATEGORY_ORDER = [
    "bcs",
    "ntrca",
    "psc-non-cadre",
    "bank",
    "government",
    "defence",
    "health",
    "admission",
    "teacher",
    "others",
    "custom",
];
// =========================================================
// DUPLICATE KEY
// =========================================================
const createDuplicateKey = (question) => {
    return [
        question.topicId.toString(),
        question.type,
        question.normalizedQuestion,
    ].join("|");
};
// =========================================================
// CREATE QUESTION
// =========================================================
const createQuestion = async (payload, userRole) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // -----------------------------------------
        // Backend decides status
        // -----------------------------------------
        const status = userRole === user_constants_1.UserRole.ADMIN
            ? question_constant_1.QuestionStatus.APPROVED
            : question_constant_1.QuestionStatus.PENDING;
        // -----------------------------------------
        // Normalize question
        // -----------------------------------------
        const normalizedQuestion = (0, question_utils_1.normalizeQuestion)(payload.questionText);
        // -----------------------------------------
        // Duplicate check
        // -----------------------------------------
        const existingQuestion = await question_model_1.Question.findOne({
            topicId: payload.topicId,
            type: payload.type,
            normalizedQuestion,
        }).session(session);
        if (existingQuestion) {
            throw new AppError_1.default(409, "এই Topic-এ একই প্রশ্ন ইতিমধ্যে রয়েছে।");
        }
        // -----------------------------------------
        // Question payload
        // -----------------------------------------
        const questionPayload = {
            ...payload,
            normalizedQuestion,
            status,
        };
        // -----------------------------------------
        // Create
        // -----------------------------------------
        const question = await question_model_1.Question.create([questionPayload], {
            session,
        });
        const createdQuestion = question[0];
        // -----------------------------------------
        // Statistics
        // -----------------------------------------
        if (status === question_constant_1.QuestionStatus.APPROVED) {
            await statistics_service_1.StatisticsService.incrementQuestionCount(createdQuestion.chapterId.toString(), 1, session);
            await statistics_service_1.StatisticsService.incrementTopicQuestionCount(createdQuestion.topicId.toString(), 1, session);
        }
        await session.commitTransaction();
        return createdQuestion;
    }
    catch (error) {
        await session.abortTransaction();
        // MongoDB unique index protection
        if (error?.code === 11000) {
            throw new AppError_1.default(409, "এই Topic-এ একই প্রশ্ন ইতিমধ্যে রয়েছে।");
        }
        throw error;
    }
    finally {
        await session.endSession();
    }
};
// =========================================================
// BULK CREATE QUESTIONS
// =========================================================
const bulkCreateQuestions = async (payload, userRole) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // -----------------------------------------
        // Backend decides status
        // -----------------------------------------
        const status = userRole === user_constants_1.UserRole.ADMIN
            ? question_constant_1.QuestionStatus.APPROVED
            : question_constant_1.QuestionStatus.PENDING;
        // -----------------------------------------
        // Normalize incoming questions
        // -----------------------------------------
        const questionPayload = payload.map((question) => ({
            ...question,
            normalizedQuestion: (0, question_utils_1.normalizeQuestion)(question.questionText),
            status,
        }));
        // =====================================================
        // REMOVE DUPLICATES INSIDE REQUEST
        // =====================================================
        const seenKeys = new Set();
        const duplicateQuestions = [];
        const uniquePayload = questionPayload.filter((question) => {
            const key = createDuplicateKey(question);
            if (seenKeys.has(key)) {
                duplicateQuestions.push(question.questionText);
                return false;
            }
            seenKeys.add(key);
            return true;
        });
        // =====================================================
        // FIND EXISTING DATABASE QUESTIONS
        // =====================================================
        const existingQuestions = uniquePayload.length > 0
            ? await question_model_1.Question.find({
                $or: uniquePayload.map((question) => ({
                    topicId: question.topicId,
                    type: question.type,
                    normalizedQuestion: question.normalizedQuestion,
                })),
            })
                .select("topicId type normalizedQuestion questionText")
                .session(session)
                .lean()
            : [];
        // =====================================================
        // EXISTING DATABASE KEYS
        // =====================================================
        const existingKeys = new Set(existingQuestions.map((question) => createDuplicateKey({
            topicId: question.topicId,
            type: question.type,
            normalizedQuestion: question.normalizedQuestion,
        })));
        // =====================================================
        // REMOVE DATABASE DUPLICATES
        // =====================================================
        const questionsToInsert = uniquePayload.filter((question) => {
            const key = createDuplicateKey(question);
            if (existingKeys.has(key)) {
                duplicateQuestions.push(question.questionText);
                return false;
            }
            return true;
        });
        // =====================================================
        // INSERT
        // =====================================================
        let questions = [];
        if (questionsToInsert.length > 0) {
            questions = await question_model_1.Question.insertMany(questionsToInsert, {
                session,
                ordered: true,
            });
        }
        // =====================================================
        // STATISTICS
        // =====================================================
        if (status === question_constant_1.QuestionStatus.APPROVED) {
            const chapterMap = new Map();
            const topicMap = new Map();
            for (const question of questions) {
                const chapterId = question.chapterId.toString();
                const topicId = question.topicId.toString();
                chapterMap.set(chapterId, (chapterMap.get(chapterId) || 0) + 1);
                topicMap.set(topicId, (topicMap.get(topicId) || 0) + 1);
            }
            // -----------------------------------------
            // Chapter statistics
            // -----------------------------------------
            for (const [chapterId, count] of chapterMap) {
                await statistics_service_1.StatisticsService.incrementQuestionCount(chapterId, count, session);
            }
            // -----------------------------------------
            // Topic statistics
            // -----------------------------------------
            for (const [topicId, count] of topicMap) {
                await statistics_service_1.StatisticsService.incrementTopicQuestionCount(topicId, count, session);
            }
        }
        // =====================================================
        // COMMIT
        // =====================================================
        await session.commitTransaction();
        return {
            total: payload.length,
            inserted: questions.length,
            duplicates: duplicateQuestions.length,
            duplicateQuestions,
        };
    }
    catch (error) {
        await session.abortTransaction();
        // MongoDB unique index protection
        if (error?.code === 11000) {
            throw new AppError_1.default(409, "এক বা একাধিক প্রশ্ন ইতিমধ্যে রয়েছে।");
        }
        throw error;
    }
    finally {
        await session.endSession();
    }
};
// =========================================================
// GET ALL QUESTIONS
// =========================================================
const getAllQuestions = async (query) => {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const filter = {};
    // =====================================================
    // ACADEMIC FILTERS
    // =====================================================
    if (query.subjectId && query.subjectId !== "all") {
        filter.subjectId = query.subjectId;
    }
    if (query.chapterId && query.chapterId !== "all") {
        filter.chapterId = query.chapterId;
    }
    if (query.topicId && query.topicId !== "all") {
        filter.topicId = query.topicId;
    }
    // =====================================================
    // METADATA FILTERS
    // =====================================================
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
    // =====================================================
    // QUESTION SEARCH
    // =====================================================
    if (typeof query.searchTerm === "string" && query.searchTerm.trim()) {
        filter.questionText = {
            $regex: query.searchTerm.trim(),
            $options: "i",
        };
    }
    // =====================================================
    // SOURCE SEARCH
    // =====================================================
    if (typeof query.sourceTitle === "string" && query.sourceTitle.trim()) {
        filter.sources = {
            $elemMatch: {
                name: {
                    $regex: query.sourceTitle.trim(),
                    $options: "i",
                },
            },
        };
    }
    // =====================================================
    // AGGREGATION
    // =====================================================
    const questions = await question_model_1.Question.aggregate([
        {
            $match: filter,
        },
        {
            $addFields: {
                categoryRanks: {
                    $map: {
                        input: {
                            $ifNull: ["$sources", []],
                        },
                        as: "source",
                        in: {
                            $indexOfArray: [CATEGORY_ORDER, "$$source.type"],
                        },
                    },
                },
            },
        },
        {
            $addFields: {
                categoryRank: {
                    $let: {
                        vars: {
                            validRanks: {
                                $filter: {
                                    input: "$categoryRanks",
                                    as: "rank",
                                    cond: {
                                        $gte: ["$$rank", 0],
                                    },
                                },
                            },
                        },
                        in: {
                            $cond: [
                                {
                                    $gt: [
                                        {
                                            $size: "$$validRanks",
                                        },
                                        0,
                                    ],
                                },
                                {
                                    $min: "$$validRanks",
                                },
                                999,
                            ],
                        },
                    },
                },
            },
        },
        {
            $sort: {
                categoryRank: 1,
                questionText: 1,
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $project: {
                categoryRanks: 0,
                categoryRank: 0,
            },
        },
    ]);
    // =====================================================
    // POPULATE
    // =====================================================
    await question_model_1.Question.populate(questions, [
        {
            path: "subjectId",
            select: "title name slug",
        },
        {
            path: "chapterId",
            select: "title name slug",
        },
        {
            path: "topicId",
            select: "title name slug",
        },
        {
            path: "createdBy",
            select: "name email",
        },
        {
            path: "approvedBy",
            select: "name email",
        },
    ]);
    // =====================================================
    // TOTAL
    // =====================================================
    const total = await question_model_1.Question.countDocuments(filter);
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
// =========================================================
// GET QUESTIONS BY TOPIC
// =========================================================
const getQuestionsByTopic = async (topicId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(topicId)) {
        throw new AppError_1.default(400, "Invalid topic ID");
    }
    const questions = await question_model_1.Question.aggregate([
        {
            $match: {
                topicId: new mongoose_1.default.Types.ObjectId(topicId),
                status: question_constant_1.QuestionStatus.APPROVED,
            },
        },
        {
            $addFields: {
                categoryRanks: {
                    $map: {
                        input: {
                            $ifNull: ["$sources", []],
                        },
                        as: "source",
                        in: {
                            $indexOfArray: [CATEGORY_ORDER, "$$source.type"],
                        },
                    },
                },
            },
        },
        {
            $addFields: {
                categoryRank: {
                    $let: {
                        vars: {
                            validRanks: {
                                $filter: {
                                    input: "$categoryRanks",
                                    as: "rank",
                                    cond: {
                                        $gte: ["$$rank", 0],
                                    },
                                },
                            },
                        },
                        in: {
                            $cond: [
                                {
                                    $gt: [
                                        {
                                            $size: "$$validRanks",
                                        },
                                        0,
                                    ],
                                },
                                {
                                    $min: "$$validRanks",
                                },
                                999,
                            ],
                        },
                    },
                },
            },
        },
        {
            $sort: {
                // categoryRank: 1,
                // questionText: 1,
                createdAt: 1,
            },
        },
        {
            $project: {
                categoryRanks: 0,
                categoryRank: 0,
            },
        },
    ]);
    await question_model_1.Question.populate(questions, [
        {
            path: "subjectId",
            select: "title name slug",
        },
        {
            path: "chapterId",
            select: "title name slug",
        },
        {
            path: "topicId",
            select: "title name slug",
        },
    ]);
    return questions;
};
// =========================================================
// GET SINGLE QUESTION
// =========================================================
const getSingleQuestion = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid question ID");
    }
    const question = await question_model_1.Question.findById(id)
        .populate("subjectId", "title name slug")
        .populate("chapterId", "title name slug")
        .populate("topicId", "title name slug")
        .populate("createdBy", "name email")
        .populate("approvedBy", "name email");
    if (!question) {
        throw new AppError_1.default(404, "Question not found");
    }
    return question;
};
// =========================================================
// UPDATE QUESTION
// =========================================================
const updateQuestion = async (id, payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // =====================================================
        // VALIDATE ID
        // =====================================================
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default(400, "Invalid question ID");
        }
        // =====================================================
        // GET OLD QUESTION
        // =====================================================
        const oldQuestion = await question_model_1.Question.findById(id).session(session);
        if (!oldQuestion) {
            throw new AppError_1.default(404, "Question not found");
        }
        // =====================================================
        // USER OWNERSHIP
        // =====================================================
        if (user.role !== user_constants_1.UserRole.ADMIN &&
            oldQuestion.createdBy.toString() !== user.id.toString()) {
            throw new AppError_1.default(403, "You can only update your own question");
        }
        // =====================================================
        // UPDATE PAYLOAD
        // =====================================================
        const updatePayload = {
            ...payload,
        };
        // Never allow createdBy from request
        delete updatePayload.createdBy;
        // Normal user cannot manipulate workflow
        if (user.role !== user_constants_1.UserRole.ADMIN) {
            delete updatePayload.status;
            delete updatePayload.approvedBy;
            delete updatePayload.approvedAt;
        }
        // =====================================================
        // OLD VALUES
        // =====================================================
        const oldChapterId = oldQuestion.chapterId.toString();
        const oldTopicId = oldQuestion.topicId.toString();
        const oldStatus = oldQuestion.status;
        // =====================================================
        // NEW VALUES
        // =====================================================
        const newChapterId = updatePayload.chapterId?.toString() || oldChapterId;
        const newTopicId = updatePayload.topicId?.toString() || oldTopicId;
        const newType = updatePayload.type || oldQuestion.type;
        const newQuestionText = updatePayload.questionText || oldQuestion.questionText;
        const newNormalizedQuestion = (0, question_utils_1.normalizeQuestion)(newQuestionText);
        const newStatus = updatePayload.status || oldStatus;
        // =====================================================
        // DUPLICATE CHECK
        // =====================================================
        const duplicateQuestion = await question_model_1.Question.findOne({
            _id: {
                $ne: id,
            },
            topicId: newTopicId,
            type: newType,
            normalizedQuestion: newNormalizedQuestion,
        }).session(session);
        if (duplicateQuestion) {
            throw new AppError_1.default(409, "এই Topic-এ একই প্রশ্ন ইতিমধ্যে রয়েছে।");
        }
        // =====================================================
        // ALWAYS STORE NORMALIZED VALUE
        // =====================================================
        updatePayload.normalizedQuestion = newNormalizedQuestion;
        // =====================================================
        // ADMIN APPROVAL
        // =====================================================
        if (user.role === user_constants_1.UserRole.ADMIN &&
            newStatus === question_constant_1.QuestionStatus.APPROVED &&
            oldStatus !== question_constant_1.QuestionStatus.APPROVED) {
            updatePayload.approvedBy = new mongoose_1.default.Types.ObjectId(user.id);
            updatePayload.approvedAt = new Date();
        }
        // =====================================================
        // ADMIN REMOVES APPROVAL
        // =====================================================
        if (user.role === user_constants_1.UserRole.ADMIN &&
            newStatus !== question_constant_1.QuestionStatus.APPROVED &&
            oldStatus === question_constant_1.QuestionStatus.APPROVED) {
            updatePayload.approvedBy = undefined;
            updatePayload.approvedAt = undefined;
        }
        // =====================================================
        // UPDATE QUESTION
        // =====================================================
        let question;
        try {
            question = await question_model_1.Question.findByIdAndUpdate(id, updatePayload, {
                new: true,
                runValidators: true,
                session,
            });
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new AppError_1.default(409, "এই Topic-এ একই প্রশ্ন ইতিমধ্যে রয়েছে।");
            }
            throw error;
        }
        if (!question) {
            throw new AppError_1.default(404, "Question not found");
        }
        // =====================================================
        // STATISTICS
        // =====================================================
        const wasApproved = oldStatus === question_constant_1.QuestionStatus.APPROVED;
        const isApproved = newStatus === question_constant_1.QuestionStatus.APPROVED;
        // =====================================================
        // APPROVED -> APPROVED
        // =====================================================
        if (wasApproved && isApproved) {
            // Chapter changed
            if (oldChapterId !== newChapterId) {
                await statistics_service_1.StatisticsService.decrementQuestionCount(oldChapterId, 1, session);
                await statistics_service_1.StatisticsService.incrementQuestionCount(newChapterId, 1, session);
            }
            // Topic changed
            if (oldTopicId !== newTopicId) {
                await statistics_service_1.StatisticsService.decrementTopicQuestionCount(oldTopicId, 1, session);
                await statistics_service_1.StatisticsService.incrementTopicQuestionCount(newTopicId, 1, session);
            }
        }
        // =====================================================
        // PENDING/REJECTED -> APPROVED
        // =====================================================
        if (!wasApproved && isApproved) {
            await statistics_service_1.StatisticsService.incrementQuestionCount(newChapterId, 1, session);
            await statistics_service_1.StatisticsService.incrementTopicQuestionCount(newTopicId, 1, session);
        }
        // =====================================================
        // APPROVED -> PENDING/REJECTED
        // =====================================================
        if (wasApproved && !isApproved) {
            await statistics_service_1.StatisticsService.decrementQuestionCount(oldChapterId, 1, session);
            await statistics_service_1.StatisticsService.decrementTopicQuestionCount(oldTopicId, 1, session);
        }
        // =====================================================
        // COMMIT
        // =====================================================
        await session.commitTransaction();
        return question;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
// =========================================================
// DELETE QUESTION
// =========================================================
const deleteQuestion = async (id) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // -----------------------------------------
        // Validate ID
        // -----------------------------------------
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default(400, "Invalid question ID");
        }
        // -----------------------------------------
        // Find question
        // -----------------------------------------
        const question = await question_model_1.Question.findById(id).session(session);
        if (!question) {
            throw new AppError_1.default(404, "Question not found");
        }
        // -----------------------------------------
        // Delete
        // -----------------------------------------
        await question_model_1.Question.findByIdAndDelete(id).session(session);
        // -----------------------------------------
        // Statistics
        // -----------------------------------------
        if (question.status === question_constant_1.QuestionStatus.APPROVED) {
            await statistics_service_1.StatisticsService.decrementQuestionCount(question.chapterId.toString(), 1, session);
            await statistics_service_1.StatisticsService.decrementTopicQuestionCount(question.topicId.toString(), 1, session);
        }
        await session.commitTransaction();
        return question;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
// =========================================================
// QUESTION STATISTICS
// =========================================================
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
// =========================================================
// EXPORT
// =========================================================
exports.QuestionService = {
    createQuestion,
    bulkCreateQuestions,
    getAllQuestions,
    getQuestionsByTopic,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionStats,
};
//# sourceMappingURL=question.service.js.map