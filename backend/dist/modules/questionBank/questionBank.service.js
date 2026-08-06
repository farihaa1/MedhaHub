"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../middlewares/QueryBuilder"));
const questionBank_model_1 = require("./questionBank.model");
const questionBank_utils_1 = require("./questionBank.utils");
const questionBank_constant_1 = require("./questionBank.constant");
/* ======================================================
   Create Question Bank
====================================================== */
const createQuestionBank = async (payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (!payload.slug) {
            payload.slug = (0, questionBank_utils_1.generateQuestionBankSlug)(payload.title);
        }
        const exists = await questionBank_model_1.QuestionBank.findOne({
            slug: payload.slug,
        }).session(session);
        if (exists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Question Bank slug already exists");
        }
        payload.createdBy = new mongoose_1.default.Types.ObjectId(user.userId);
        const [questionBank] = await questionBank_model_1.QuestionBank.create([payload], {
            session,
        });
        await session.commitTransaction();
        return questionBank;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
};
/* ======================================================
   Get All Question Banks
====================================================== */
const getAllQuestionBanks = async (query) => {
    const qb = new QueryBuilder_1.default(questionBank_model_1.QuestionBank.find(), query)
        .search(questionBank_constant_1.QUESTION_BANK_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await qb.modelQuery.populate("createdBy", "name email");
    const meta = await qb.countTotal();
    return {
        meta,
        data,
    };
};
/* ======================================================
   Get Single Question Bank
====================================================== */
const getSingleQuestionBank = async (identifier) => {
    const questionBank = await questionBank_model_1.QuestionBank.findOne({
        $or: [
            {
                _id: mongoose_1.default.isValidObjectId(identifier) ? identifier : undefined,
            },
            {
                slug: identifier,
            },
        ],
    })
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .populate("deletedBy", "name email");
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
    }
    return questionBank;
};
/* ======================================================
   Update Question Bank
====================================================== */
const updateQuestionBank = async (id, payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const questionBank = await questionBank_model_1.QuestionBank.findById(id).session(session);
        if (!questionBank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
        }
        /**
         * Generate new slug if title changes
         */
        if (payload.title &&
            payload.title !== questionBank.title &&
            !payload.slug) {
            payload.slug = (0, questionBank_utils_1.generateQuestionBankSlug)(payload.title);
        }
        /**
         * Check duplicate slug
         */
        if (payload.slug) {
            const exists = await questionBank_model_1.QuestionBank.findOne({
                slug: payload.slug,
                _id: { $ne: id },
            }).session(session);
            if (exists) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Question Bank slug already exists");
            }
        }
        payload.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
        const updated = await questionBank_model_1.QuestionBank.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        await session.commitTransaction();
        return updated;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
};
/* ======================================================
   Soft Delete
====================================================== */
const deleteQuestionBank = async (id, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const questionBank = await questionBank_model_1.QuestionBank.findById(id).session(session);
        if (!questionBank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
        }
        questionBank.isDeleted = true;
        questionBank.deletedAt = new Date();
        questionBank.deletedBy = new mongoose_1.default.Types.ObjectId(user.userId);
        questionBank.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
        await questionBank.save({ session });
        await session.commitTransaction();
        return null;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
};
/* ======================================================
   Helpers
====================================================== */
const getQuestionBankOrThrow = async (id) => {
    const questionBank = await questionBank_model_1.QuestionBank.findById(id);
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question Bank not found");
    }
    return questionBank;
};
/* ======================================================
   Export
====================================================== */
exports.QuestionBankService = {
    createQuestionBank,
    getAllQuestionBanks,
    getSingleQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
    getQuestionBankOrThrow,
};
//# sourceMappingURL=questionBank.service.js.map