import httpStatus from "http-status";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

import AppError from "../../error/AppError";
import QueryBuilder from "../../middlewares/QueryBuilder";

import { IQuestionBank } from "./questionBank.interface";
import { QuestionBank } from "./questionBank.model";
import { generateQuestionBankSlug } from "./questionBank.utils";
import { QUESTION_BANK_SEARCHABLE_FIELDS } from "./questionBank.constant";

/* ======================================================
   Create Question Bank
====================================================== */

const createQuestionBank = async (payload: IQuestionBank, user: JwtPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!payload.slug) {
      payload.slug = generateQuestionBankSlug(payload.title);
    }

    const exists = await QuestionBank.findOne({
      slug: payload.slug,
    }).session(session);

    if (exists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Question Bank slug already exists",
      );
    }

    payload.createdBy = new mongoose.Types.ObjectId(user.userId);

    const [questionBank] = await QuestionBank.create([payload], {
      session,
    });

    await session.commitTransaction();

    return questionBank;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/* ======================================================
   Get All Question Banks
====================================================== */

const getAllQuestionBanks = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(QuestionBank.find(), query)
    .search(QUESTION_BANK_SEARCHABLE_FIELDS)
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

const getSingleQuestionBank = async (identifier: string) => {
  const questionBank = await QuestionBank.findOne({
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
    .populate("deletedBy", "name email");

  if (!questionBank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
  }

  return questionBank;
};

/* ======================================================
   Update Question Bank
====================================================== */

const updateQuestionBank = async (
  id: string,
  payload: Partial<IQuestionBank>,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const questionBank = await QuestionBank.findById(id).session(session);

    if (!questionBank) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Question Bank not found",
      );
    }

    /**
     * Generate new slug if title changes
     */
    if (
      payload.title &&
      payload.title !== questionBank.title &&
      !payload.slug
    ) {
      payload.slug = generateQuestionBankSlug(payload.title);
    }

    /**
     * Check duplicate slug
     */
    if (payload.slug) {
      const exists = await QuestionBank.findOne({
        slug: payload.slug,
        _id: { $ne: id },
      }).session(session);

      if (exists) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Question Bank slug already exists",
        );
      }
    }

    payload.updatedBy = new mongoose.Types.ObjectId(user.userId);

    const updated = await QuestionBank.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    await session.commitTransaction();

    return updated;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/* ======================================================
   Soft Delete
====================================================== */

const deleteQuestionBank = async (
  id: string,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const questionBank = await QuestionBank.findById(id).session(session);

    if (!questionBank) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Question Bank not found",
      );
    }

    questionBank.isDeleted = true;
    questionBank.deletedAt = new Date();
    questionBank.deletedBy = new mongoose.Types.ObjectId(user.userId);
    questionBank.updatedBy = new mongoose.Types.ObjectId(user.userId);

    await questionBank.save({ session });

    await session.commitTransaction();

    return null;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/* ======================================================
   Helpers
====================================================== */

const getQuestionBankOrThrow = async (id: string) => {
  const questionBank = await QuestionBank.findById(id);

  if (!questionBank) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Question Bank not found",
    );
  }

  return questionBank;
};

/* ======================================================
   Export
====================================================== */

export const QuestionBankService = {
  createQuestionBank,
  getAllQuestionBanks,
  getSingleQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
  getQuestionBankOrThrow,
};