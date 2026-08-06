"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBanksService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../middlewares/QueryBuilder"));
const questionBanks_model_1 = require("./questionBanks.model");
const questionBanks_constant_1 = require("./questionBanks.constant");
const questionBanks_utils_1 = require("./questionBanks.utils");
const questionBankItem_model_1 = require("../questionBankItems/questionBankItem.model");
const question_model_1 = require("../Questions/question.model");
/* ============================================================
   Create
============================================================ */
const createQuestionBanks = async (payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        payload.createdBy = new mongoose_1.default.Types.ObjectId(user.userId);
        /**
         * ======================================================
         * USER
         *
         * Always REVIEW
         * Slug must remain null
         * ======================================================
         */
        if (user.role === "USER") {
            payload.slug = null;
            payload.status = questionBanks_constant_1.QuestionBanksStatus.REVIEW;
        }
        /**
         * ======================================================
         * ADMIN
         *
         * Must provide slug
         * Published immediately
         * ======================================================
         */
        if (user.role === "ADMIN") {
            if (!payload.slug) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug is required.");
            }
            payload.slug = (0, questionBanks_utils_1.normalizeSlug)(payload.slug);
            const slugExists = await questionBanks_model_1.QuestionBanks.findOne({
                slug: payload.slug,
            }).session(session);
            if (slugExists) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug already exists.");
            }
            payload.status = questionBanks_constant_1.QuestionBanksStatus.PUBLISHED;
            payload.approvedBy = new mongoose_1.default.Types.ObjectId(user.userId);
            payload.approvedAt = new Date();
            payload.publishedAt = new Date();
        }
        const [questionBank] = await questionBanks_model_1.QuestionBanks.create([payload], { session });
        await session.commitTransaction();
        return questionBank;
    }
    catch (error) {
        await session.abortTransaction();
        if (error.code === 11000) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug already exists.");
        }
        throw error;
    }
    finally {
        session.endSession();
    }
};
/* ============================================================
   Bulk Create (Admin Only)
============================================================ */
// const bulkCreateQuestionBanks = async (
//   payloads: IQuestionBanks[],
//   user: JwtPayload,
// ) => {
//   const session: ClientSession = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     if (user.role !== "ADMIN") {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         "Only admin can bulk create question banks.",
//       );
//     }
//     if (!payloads.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "No question banks provided.");
//     }
//     const createdBy = new mongoose.Types.ObjectId(user.userId);
//     const slugs: string[] = [];
//     for (const payload of payloads) {
//       if (!payload.slug) {
//         throw new AppError(
//           httpStatus.BAD_REQUEST,
//           `Slug is required for "${payload.title}".`,
//         );
//       }
//       payload.slug = normalizeSlug(payload.slug);
//       payload.createdBy = createdBy;
//       payload.status = QuestionBanksStatus.PUBLISHED;
//       payload.approvedBy = createdBy;
//       payload.approvedAt = new Date();
//       payload.publishedAt = new Date();
//       slugs.push(payload.slug);
//     }
//     /**
//      * =============================================
//      * Duplicate slug inside request
//      * =============================================
//      */
//     const duplicateSlug = slugs.find(
//       (slug, index) => slugs.indexOf(slug) !== index,
//     );
//     if (duplicateSlug) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         `Duplicate slug: ${duplicateSlug}`,
//       );
//     }
//     /**
//      * =============================================
//      * Duplicate slug in database
//      * =============================================
//      */
//     const exists = await QuestionBanks.find({
//       slug: {
//         $in: slugs,
//       },
//     })
//       .select("slug")
//       .session(session);
//     if (exists.length) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         `Slug already exists: ${exists[0].slug}`,
//       );
//     }
//     const created = await QuestionBanks.insertMany(payloads, {
//       ordered: true,
//       session,
//     });
//     await session.commitTransaction();
//     return created;
//   } catch (error: any) {
//     await session.abortTransaction();
//     if (error.code === 11000) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Duplicate slug.");
//     }
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };
const bulkCreateQuestionBanks = async (payloads, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // ==========================================
        // TEMPORARY DEVELOPMENT BYPASS
        // ==========================================
        const adminId = "6a4e119f62d0b7109cc08c31";
        const isDevelopment = true;
        const currentUser = isDevelopment
            ? {
                userId: adminId,
                role: "admin",
            }
            : user;
        if (!currentUser) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
        }
        if (currentUser.role.toLowerCase() !== "admin") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admin can bulk create question banks.");
        }
        if (!payloads.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No question banks provided.");
        }
        const createdBy = new mongoose_1.default.Types.ObjectId(currentUser.userId);
        const slugs = [];
        for (const payload of payloads) {
            if (!payload.slug) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Slug is required for "${payload.title}".`);
            }
            payload.slug = (0, questionBanks_utils_1.normalizeSlug)(payload.slug);
            payload.createdBy = createdBy;
            payload.status = questionBanks_constant_1.QuestionBanksStatus.PUBLISHED;
            payload.approvedBy = createdBy;
            payload.approvedAt = new Date();
            payload.publishedAt = new Date();
            slugs.push(payload.slug);
        }
        const duplicateSlug = slugs.find((slug, index) => slugs.indexOf(slug) !== index);
        if (duplicateSlug) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Duplicate slug: ${duplicateSlug}`);
        }
        const exists = await questionBanks_model_1.QuestionBanks.find({
            slug: { $in: slugs },
        })
            .select("slug")
            .session(session);
        if (exists.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Slug already exists: ${exists[0].slug}`);
        }
        const created = await questionBanks_model_1.QuestionBanks.insertMany(payloads, {
            ordered: true,
            session,
        });
        await session.commitTransaction();
        return created;
    }
    catch (error) {
        await session.abortTransaction();
        if (error.code === 11000) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Duplicate slug.");
        }
        throw error;
    }
    finally {
        session.endSession();
    }
};
/* ============================================================
   Get All
============================================================ */
const getAllQuestionBanks = async (query) => {
    const hasPagination = query.page !== undefined || query.limit !== undefined;
    const queryBuilder = new QueryBuilder_1.default(questionBanks_model_1.QuestionBanks.find(), query)
        .search(questionBanks_constant_1.QUESTION_BANKS_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .fields();
    // Default sort if client didn't specify one
    if (!query.sortBy) {
        queryBuilder.modelQuery = queryBuilder.modelQuery.sort({
            year: -1,
            createdAt: -1,
        });
    }
    if (hasPagination) {
        queryBuilder.paginate();
    }
    const data = await queryBuilder.modelQuery
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .populate("approvedBy", "name email");
    const meta = hasPagination
        ? await queryBuilder.countTotal()
        : {
            total: data.length,
        };
    return {
        meta,
        data,
    };
};
/* ============================================================
   Get Single
============================================================ */
const getSingleQuestionBanks = async (identifier) => {
    const questionBank = await questionBanks_model_1.QuestionBanks.findOne({
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
        .populate("approvedBy", "name email")
        .populate("deletedBy", "name email")
        .populate("restoredBy", "name email");
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
    }
    return questionBank;
};
/* ============================================================
   Update (Admin Only)
============================================================ */
const updateQuestionBanks = async (id, payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (user.role !== "ADMIN") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admin can update question banks.");
        }
        const questionBank = await questionBanks_model_1.QuestionBanks.findById(id).session(session);
        if (!questionBank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
        }
        /**
         * Slug can only be changed
         * by admin
         */
        if (payload.slug) {
            payload.slug = (0, questionBanks_utils_1.normalizeSlug)(payload.slug);
            const exists = await questionBanks_model_1.QuestionBanks.findOne({
                slug: payload.slug,
                _id: {
                    $ne: id,
                },
            }).session(session);
            if (exists) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug already exists.");
            }
        }
        /**
         * Prevent changing workflow fields
         * through update endpoint
         */
        delete payload.status;
        delete payload.approvedAt;
        delete payload.approvedBy;
        delete payload.publishedAt;
        delete payload.reviewRemark;
        payload.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
        const updated = await questionBanks_model_1.QuestionBanks.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        })
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .populate("approvedBy", "name email");
        await session.commitTransaction();
        return updated;
    }
    catch (error) {
        await session.abortTransaction();
        if (error.code === 11000) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug already exists.");
        }
        throw error;
    }
    finally {
        session.endSession();
    }
};
/* ============================================================
   Publish (Admin Only)
============================================================ */
const publishQuestionBanks = async (id, payload, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (user.role !== "ADMIN") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admin can publish question banks.");
        }
        const questionBank = await questionBanks_model_1.QuestionBanks.findById(id).session(session);
        if (!questionBank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
        }
        if (questionBank.status !== questionBanks_constant_1.QuestionBanksStatus.REVIEW) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Question bank is not under review.");
        }
        const slug = (0, questionBanks_utils_1.normalizeSlug)(payload.slug);
        const exists = await questionBanks_model_1.QuestionBanks.findOne({
            slug,
            _id: {
                $ne: id,
            },
        }).session(session);
        if (exists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug already exists.");
        }
        questionBank.slug = slug;
        questionBank.status = questionBanks_constant_1.QuestionBanksStatus.PUBLISHED;
        questionBank.approvedBy = new mongoose_1.default.Types.ObjectId(user.userId);
        questionBank.approvedAt = new Date();
        questionBank.publishedAt = new Date();
        questionBank.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
        await questionBank.save({
            session,
        });
        await session.commitTransaction();
        return questionBank;
    }
    catch (error) {
        await session.abortTransaction();
        if (error.code === 11000) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slug already exists.");
        }
        throw error;
    }
    finally {
        session.endSession();
    }
};
/* ============================================================
   Reject (Admin Only)
============================================================ */
const rejectQuestionBanks = async (id, payload, user) => {
    const questionBank = await questionBanks_model_1.QuestionBanks.findById(id);
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
    }
    questionBank.status = questionBanks_constant_1.QuestionBanksStatus.REJECTED;
    questionBank.reviewRemark = payload.reviewRemark;
    questionBank.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
    await questionBank.save();
    return questionBank;
};
/* ============================================================
   Archive
============================================================ */
const archiveQuestionBanks = async (id, user) => {
    const questionBank = await questionBanks_model_1.QuestionBanks.findById(id);
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
    }
    questionBank.status = questionBanks_constant_1.QuestionBanksStatus.ARCHIVED;
    questionBank.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
    await questionBank.save();
    return questionBank;
};
/* ============================================================
   Restore
============================================================ */
const restoreQuestionBanks = async (id, user) => {
    const questionBank = await questionBanks_model_1.QuestionBanks.findOne({
        _id: id,
    }).setOptions({
        bypassDocumentValidation: true,
    });
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
    }
    questionBank.isDeleted = false;
    questionBank.deletedAt = null;
    questionBank.deletedBy = null;
    questionBank.restoredAt = new Date();
    questionBank.restoredBy = new mongoose_1.default.Types.ObjectId(user.userId);
    questionBank.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
    await questionBank.save();
    return questionBank;
};
/* ============================================================
   Soft Delete
============================================================ */
const deleteQuestionBanks = async (id, user) => {
    const questionBank = await questionBanks_model_1.QuestionBanks.findById(id);
    if (!questionBank) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
    }
    questionBank.isDeleted = true;
    questionBank.deletedAt = new Date();
    questionBank.deletedBy = new mongoose_1.default.Types.ObjectId(user.userId);
    questionBank.updatedBy = new mongoose_1.default.Types.ObjectId(user.userId);
    await questionBank.save();
    return null;
};
const importQuestions = async (questionBankId, questions, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const bank = await questionBanks_model_1.QuestionBanks.findById(questionBankId).session(session);
        if (!bank) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question bank not found.");
        }
        const createdQuestions = await question_model_1.Question.insertMany(questions, {
            session,
        });
        const existingCount = await questionBankItem_model_1.QuestionBankItem.countDocuments({
            questionBank: questionBankId,
        }).session(session);
        const items = createdQuestions.map((question, index) => ({
            questionBank: questionBankId,
            question: question._id,
            order: existingCount + index + 1,
            marks: 1,
            negativeMarks: 0,
            createdBy: new mongoose_1.default.Types.ObjectId(user.userId),
        }));
        await questionBankItem_model_1.QuestionBankItem.insertMany(items, {
            session,
        });
        bank.totalQuestions += createdQuestions.length;
        await bank.save({
            session,
        });
        await session.commitTransaction();
        return {
            bank,
            imported: createdQuestions.length,
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
/* ============================================================
   Export
============================================================ */
exports.QuestionBanksService = {
    createQuestionBanks,
    bulkCreateQuestionBanks,
    getAllQuestionBanks,
    getSingleQuestionBanks,
    updateQuestionBanks,
    publishQuestionBanks,
    rejectQuestionBanks,
    archiveQuestionBanks,
    restoreQuestionBanks,
    deleteQuestionBanks,
    importQuestions,
};
//# sourceMappingURL=questionBanks.service.js.map