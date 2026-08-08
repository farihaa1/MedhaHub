"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankItemService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importStar(require("mongoose"));
const questionBankItem_model_1 = require("./questionBankItem.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const question_model_1 = require("../Questions/question.model");
const QueryBuilder_1 = __importDefault(require("../../middlewares/QueryBuilder"));
const questionBanks_model_1 = require("../questionBanks/questionBanks.model");
const addQuestionToBank = async (questionBankId, payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        /**
         * Check Question Bank
         */
        const bank = await questionBanks_model_1.QuestionBanks.findById(questionBankId).session(session);
        if (!bank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
        }
        /**
         * Check Question
         */
        const question = await question_model_1.Question.findById(payload.question).session(session);
        if (!question) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question not found");
        }
        /**
         * Prevent Duplicate
         */
        const exists = await questionBankItem_model_1.QuestionBankItem.findOne({
            questionBank: questionBankId,
            question: payload.question,
        }).session(session);
        if (exists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Question already exists in this Question Bank");
        }
        /**
         * Auto Generate Order
         */
        let order = payload.order;
        if (!order) {
            const lastItem = await questionBankItem_model_1.QuestionBankItem.findOne({
                questionBank: questionBankId,
            })
                .sort({ order: -1 })
                .session(session);
            order = lastItem ? lastItem.order + 1 : 1;
        }
        /**
         * Create Question Bank Item
         */
        const [item] = await questionBankItem_model_1.QuestionBankItem.create([
            {
                questionBank: new mongoose_1.Types.ObjectId(questionBankId),
                question: new mongoose_1.Types.ObjectId(payload.question),
                order,
                marks: payload.marks ?? 1,
                negativeMarks: payload.negativeMarks ?? 0,
                createdBy: new mongoose_1.Types.ObjectId(user.id),
            },
        ], {
            session,
        });
        /**
         * Sync Total Questions
         */
        await syncQuestionBankTotalQuestions(questionBankId, session);
        await session.commitTransaction();
        return item;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const bulkAddQuestions = async (questionBankId, questionIds, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        /**
         * Check Question Bank
         */
        const bank = await questionBanks_model_1.QuestionBanks.findById(questionBankId).session(session);
        if (!bank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
        }
        /**
         * Get Last Order
         */
        const lastItem = await questionBankItem_model_1.QuestionBankItem.findOne({
            questionBank: questionBankId,
        })
            .sort({ order: -1 })
            .session(session);
        let order = lastItem ? lastItem.order + 1 : 1;
        /**
         * Already Existing Questions
         */
        const existingItems = await questionBankItem_model_1.QuestionBankItem.find({
            questionBank: questionBankId,
            question: { $in: questionIds },
        }).session(session);
        const existingIds = new Set(existingItems.map((item) => item.question.toString()));
        /**
         * Verify Question IDs
         */
        const validQuestions = await question_model_1.Question.find({
            _id: { $in: questionIds },
        })
            .select("_id")
            .session(session);
        const validIds = new Set(validQuestions.map((question) => question._id.toString()));
        /**
         * Prepare Documents
         */
        const documents = [];
        for (const questionId of questionIds) {
            if (!validIds.has(questionId))
                continue;
            if (existingIds.has(questionId))
                continue;
            documents.push({
                questionBank: new mongoose_1.Types.ObjectId(questionBankId),
                question: new mongoose_1.Types.ObjectId(questionId),
                order: order++,
                marks: 1,
                negativeMarks: 0,
                createdBy: new mongoose_1.Types.ObjectId(user.id),
            });
        }
        if (documents.length === 0) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No new questions to add");
        }
        /**
         * Insert Items
         */
        await questionBankItem_model_1.QuestionBankItem.insertMany(documents, {
            session,
        });
        /**
         * Sync Total Questions
         */
        await syncQuestionBankTotalQuestions(questionBankId, session);
        await session.commitTransaction();
        return {
            inserted: documents.length,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const syncQuestionBankTotalQuestions = async (questionBankId, session) => {
    const totalQuestions = await questionBankItem_model_1.QuestionBankItem.countDocuments({
        questionBank: new mongoose_1.Types.ObjectId(questionBankId),
        isActive: true,
    }).session(session ?? null);
    await questionBanks_model_1.QuestionBanks.findByIdAndUpdate(questionBankId, {
        $set: {
            totalQuestions,
        },
    }, {
        session,
        runValidators: true,
    });
};
const getQuestionsByBank = async (questionBankId, query) => {
    /**
     * Check Question Bank
     */
    const bank = await questionBanks_model_1.QuestionBanks.findById(questionBankId);
    if (!bank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
    }
    /**
     * Build Query
     */
    const queryBuilder = new QueryBuilder_1.default(questionBankItem_model_1.QuestionBankItem.find({
        questionBank: new mongoose_1.Types.ObjectId(questionBankId),
        isActive: true,
    }).populate({
        path: "question",
        populate: [
            {
                path: "subjectId",
                select: "title slug",
            },
            {
                path: "chapterId",
                select: "title slug",
            },
            {
                path: "topicId",
                select: "title slug",
            },
        ],
    }), query)
        .sort()
        .paginate()
        .fields();
    /**
     * Execute Query
     */
    const data = await queryBuilder.modelQuery;
    const meta = await queryBuilder.countTotal();
    return {
        meta,
        data,
    };
};
const removeQuestionFromBank = async (questionBankId, questionId) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        /**
         * Check Question Bank
         */
        const bank = await questionBanks_model_1.QuestionBanks.findById(questionBankId).session(session);
        if (!bank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
        }
        /**
         * Check Question Bank Item
         */
        const item = await questionBankItem_model_1.QuestionBankItem.findOne({
            questionBank: new mongoose_1.Types.ObjectId(questionBankId),
            question: new mongoose_1.Types.ObjectId(questionId),
        }).session(session);
        if (!item) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question not found in this Question Bank");
        }
        /**
         * Remove Mapping
         */
        await questionBankItem_model_1.QuestionBankItem.deleteOne({
            _id: item._id,
        }, {
            session,
        });
        /**
         * Sync Total Questions
         */
        await syncQuestionBankTotalQuestions(questionBankId, session);
        await session.commitTransaction();
        return null;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const reorderQuestions = async (questionBankId, items) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        /**
         * Check Question Bank
         */
        const bank = await questionBanks_model_1.QuestionBanks.findById(questionBankId).session(session);
        if (!bank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
        }
        /**
         * Validate Items
         */
        if (items.length === 0) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No questions provided for reordering");
        }
        /**
         * Bulk Update Orders
         */
        const operations = items.map((item) => ({
            updateOne: {
                filter: {
                    _id: new mongoose_1.Types.ObjectId(item.id),
                    questionBank: new mongoose_1.Types.ObjectId(questionBankId),
                    isActive: true,
                },
                update: {
                    $set: {
                        order: item.order,
                    },
                },
            },
        }));
        await questionBankItem_model_1.QuestionBankItem.bulkWrite(operations, {
            session,
        });
        await session.commitTransaction();
        return null;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const updateQuestionBankItem = async (id, payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        /**
         * Check Item
         */
        const item = await questionBankItem_model_1.QuestionBankItem.findById(id).session(session);
        if (!item) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank Item not found");
        }
        /**
         * Update Item
         */
        const updatedItem = await questionBankItem_model_1.QuestionBankItem.findByIdAndUpdate(id, {
            ...payload,
            updatedBy: new mongoose_1.Types.ObjectId(user.id),
        }, {
            new: true,
            runValidators: true,
            session,
        });
        /**
         * Sync Total Questions
         * (Required when isActive changes)
         */
        await syncQuestionBankTotalQuestions(item.questionBank.toString(), session);
        await session.commitTransaction();
        return updatedItem;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const getQuestionBankOrThrow = async (id, session) => {
    const questionBank = await questionBanks_model_1.QuestionBanks.findById(id).session(session ?? null);
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
    }
    return questionBank;
};
exports.QuestionBankItemService = {
    addQuestionToBank,
    bulkAddQuestions,
    getQuestionsByBank,
    removeQuestionFromBank,
    reorderQuestions,
    updateQuestionBankItem,
};
//# sourceMappingURL=questionBankItem.service.js.map