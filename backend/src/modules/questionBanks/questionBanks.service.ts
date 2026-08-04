import httpStatus from "http-status";
import mongoose, { ClientSession } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

import AppError from "../../error/AppError";
import QueryBuilder from "../../middlewares/QueryBuilder";

import { QuestionBanks } from "./questionBanks.model";
import { IQuestionBanks } from "./questionBanks.interface";
import {
  QUESTION_BANKS_SEARCHABLE_FIELDS,
  QuestionBanksStatus,
} from "./questionBanks.constant";
import { normalizeSlug } from "./questionBanks.utils";
import { QuestionBankItem } from "../questionBankItems/questionBankItem.model";
import { Question } from "../Questions/question.model";

/* ============================================================
   Create
============================================================ */

const createQuestionBanks = async (
  payload: IQuestionBanks,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    payload.createdBy = new mongoose.Types.ObjectId(user.userId);

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
      payload.status = QuestionBanksStatus.REVIEW;
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
        throw new AppError(httpStatus.BAD_REQUEST, "Slug is required.");
      }

      payload.slug = normalizeSlug(payload.slug);

      const slugExists = await QuestionBanks.findOne({
        slug: payload.slug,
      }).session(session);

      if (slugExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists.");
      }

      payload.status = QuestionBanksStatus.PUBLISHED;
      payload.approvedBy = new mongoose.Types.ObjectId(user.userId);
      payload.approvedAt = new Date();
      payload.publishedAt = new Date();
    }

    const [questionBank] = await QuestionBanks.create([payload], { session });

    await session.commitTransaction();

    return questionBank;
  } catch (error: any) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists.");
    }

    throw error;
  } finally {
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

const bulkCreateQuestionBanks = async (
  payloads: IQuestionBanks[],
  user?: JwtPayload,
) => {
  const session = await mongoose.startSession();

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
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    if (currentUser.role.toLowerCase() !== "admin") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only admin can bulk create question banks.",
      );
    }

    if (!payloads.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "No question banks provided.");
    }

    const createdBy = new mongoose.Types.ObjectId(currentUser.userId);

    const slugs: string[] = [];

    for (const payload of payloads) {
      if (!payload.slug) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Slug is required for "${payload.title}".`,
        );
      }

      payload.slug = normalizeSlug(payload.slug);

      payload.createdBy = createdBy;

      payload.status = QuestionBanksStatus.PUBLISHED;

      payload.approvedBy = createdBy;
      payload.approvedAt = new Date();
      payload.publishedAt = new Date();

      slugs.push(payload.slug);
    }

    const duplicateSlug = slugs.find(
      (slug, index) => slugs.indexOf(slug) !== index,
    );

    if (duplicateSlug) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Duplicate slug: ${duplicateSlug}`,
      );
    }

    const exists = await QuestionBanks.find({
      slug: { $in: slugs },
    })
      .select("slug")
      .session(session);

    if (exists.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Slug already exists: ${exists[0].slug}`,
      );
    }

    const created = await QuestionBanks.insertMany(payloads, {
      ordered: true,
      session,
    });

    await session.commitTransaction();

    return created;
  } catch (error: any) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new AppError(httpStatus.BAD_REQUEST, "Duplicate slug.");
    }

    throw error;
  } finally {
    session.endSession();
  }
};

/* ============================================================
   Get All
============================================================ */

const getAllQuestionBanks = async (query: Record<string, unknown>) => {
  const hasPagination = query.page !== undefined || query.limit !== undefined;

  const queryBuilder = new QueryBuilder(QuestionBanks.find(), query)
    .search(QUESTION_BANKS_SEARCHABLE_FIELDS)
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

const getSingleQuestionBanks = async (identifier: string) => {
  const questionBank = await QuestionBanks.findOne({
    $or: [
      {
        _id: mongoose.isValidObjectId(identifier) ? identifier : undefined,
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
    throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
  }

  return questionBank;
};

/* ============================================================
   Update (Admin Only)
============================================================ */

const updateQuestionBanks = async (
  id: string,
  payload: Partial<IQuestionBanks>,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (user.role !== "ADMIN") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only admin can update question banks.",
      );
    }

    const questionBank = await QuestionBanks.findById(id).session(session);

    if (!questionBank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
    }

    /**
     * Slug can only be changed
     * by admin
     */

    if (payload.slug) {
      payload.slug = normalizeSlug(payload.slug);

      const exists = await QuestionBanks.findOne({
        slug: payload.slug,
        _id: {
          $ne: id,
        },
      }).session(session);

      if (exists) {
        throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists.");
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

    payload.updatedBy = new mongoose.Types.ObjectId(user.userId);

    const updated = await QuestionBanks.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("approvedBy", "name email");

    await session.commitTransaction();

    return updated;
  } catch (error: any) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists.");
    }

    throw error;
  } finally {
    session.endSession();
  }
};

/* ============================================================
   Publish (Admin Only)
============================================================ */

const publishQuestionBanks = async (
  id: string,
  payload: {
    slug: string;
  },
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (user.role !== "ADMIN") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only admin can publish question banks.",
      );
    }

    const questionBank = await QuestionBanks.findById(id).session(session);

    if (!questionBank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
    }

    if (questionBank.status !== QuestionBanksStatus.REVIEW) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Question bank is not under review.",
      );
    }

    const slug = normalizeSlug(payload.slug);

    const exists = await QuestionBanks.findOne({
      slug,
      _id: {
        $ne: id,
      },
    }).session(session);

    if (exists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists.");
    }

    questionBank.slug = slug;
    questionBank.status = QuestionBanksStatus.PUBLISHED;

    questionBank.approvedBy = new mongoose.Types.ObjectId(user.userId);

    questionBank.approvedAt = new Date();

    questionBank.publishedAt = new Date();

    questionBank.updatedBy = new mongoose.Types.ObjectId(user.userId);

    await questionBank.save({
      session,
    });

    await session.commitTransaction();

    return questionBank;
  } catch (error: any) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists.");
    }

    throw error;
  } finally {
    session.endSession();
  }
};

/* ============================================================
   Reject (Admin Only)
============================================================ */

const rejectQuestionBanks = async (
  id: string,
  payload: {
    reviewRemark: string;
  },
  user: JwtPayload,
) => {
  const questionBank = await QuestionBanks.findById(id);

  if (!questionBank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
  }

  questionBank.status = QuestionBanksStatus.REJECTED;

  questionBank.reviewRemark = payload.reviewRemark;

  questionBank.updatedBy = new mongoose.Types.ObjectId(user.userId);

  await questionBank.save();

  return questionBank;
};

/* ============================================================
   Archive
============================================================ */

const archiveQuestionBanks = async (id: string, user: JwtPayload) => {
  const questionBank = await QuestionBanks.findById(id);

  if (!questionBank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
  }

  questionBank.status = QuestionBanksStatus.ARCHIVED;

  questionBank.updatedBy = new mongoose.Types.ObjectId(user.userId);

  await questionBank.save();

  return questionBank;
};

/* ============================================================
   Restore
============================================================ */

const restoreQuestionBanks = async (id: string, user: JwtPayload) => {
  const questionBank = await QuestionBanks.findOne({
    _id: id,
  }).setOptions({
    bypassDocumentValidation: true,
  });

  if (!questionBank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
  }

  questionBank.isDeleted = false;

  questionBank.deletedAt = null;

  questionBank.deletedBy = null;

  questionBank.restoredAt = new Date();

  questionBank.restoredBy = new mongoose.Types.ObjectId(user.userId);

  questionBank.updatedBy = new mongoose.Types.ObjectId(user.userId);

  await questionBank.save();

  return questionBank;
};

/* ============================================================
   Soft Delete
============================================================ */

const deleteQuestionBanks = async (id: string, user: JwtPayload) => {
  const questionBank = await QuestionBanks.findById(id);

  if (!questionBank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
  }

  questionBank.isDeleted = true;

  questionBank.deletedAt = new Date();

  questionBank.deletedBy = new mongoose.Types.ObjectId(user.userId);

  questionBank.updatedBy = new mongoose.Types.ObjectId(user.userId);

  await questionBank.save();

  return null;
};

const importQuestions = async (
  questionBankId: string,
  questions: any[],
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bank = await QuestionBanks.findById(questionBankId).session(session);

    if (!bank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question bank not found.");
    }

    const createdQuestions = await Question.insertMany(questions, {
      session,
    });

    const existingCount = await QuestionBankItem.countDocuments({
      questionBank: questionBankId,
    }).session(session);

    const items = createdQuestions.map((question, index) => ({
      questionBank: questionBankId,
      question: question._id,
      order: existingCount + index + 1,
      marks: 1,
      negativeMarks: 0,
      createdBy: new mongoose.Types.ObjectId(user.userId),
    }));

    await QuestionBankItem.insertMany(items, {
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
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/* ============================================================
   Export
============================================================ */

export const QuestionBanksService = {
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
