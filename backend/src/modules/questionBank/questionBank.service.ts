import httpStatus from "http-status";
import mongoose from "mongoose";
import { TQuestionBank } from "./questionBank.interface";
import { QuestionBank } from "./questionBank.model";
import { QUESTION_BANK_SEARCHABLE_FIELDS } from "./questionBank.constant";
import { generateQuestionBankSlug } from "./questionBank.utils";
import AppError from "../../error/AppError";
import QueryBuilder from "../../middlewares/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";

const createQuestionBank = async (payload: TQuestionBank, user: JwtPayload) => {
  if (!payload.slug) {
    payload.slug = generateQuestionBankSlug(payload.title);
  }

  const exists = await QuestionBank.isSlugExists(payload.slug);

  if (exists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Question Bank slug already exists",
    );
  }

  payload.createdBy = new mongoose.Types.ObjectId(user.id);

  return await QuestionBank.create(payload);
};

const getAllQuestionBanks = async (query: Record<string, unknown>) => {
  const questionBankQuery = new QueryBuilder(
    QuestionBank.find({
      isDeleted: {
        $ne: true,
      },
    }),
    query,
  )
    .search(QUESTION_BANK_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await questionBankQuery.modelQuery;

  const meta = await questionBankQuery.countTotal();

  return {
    meta,
    data,
  };
};

const getSingleQuestionBank = async (identifier: string) => {
  const result = await QuestionBank.findOne({
    $or: [{ _id: identifier }, { slug: identifier }],
    isDeleted: false,
  })
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .populate("deletedBy", "name email");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
  }

  return result;
};

const updateQuestionBank = async (
  id: string,
  payload: Partial<TQuestionBank>,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bank = await QuestionBank.findOne({
      _id: id,
      isDeleted: { $ne: true },
    }).session(session);
    if (!bank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
    }

    /**
     * Slug Regeneration
     */

    if (payload.title && payload.title !== bank.title) {
      payload.slug = generateQuestionBankSlug(payload.title);
    }

    /**
     * Duplicate Slug Check
     */

    if (payload.slug) {
      const existing = await QuestionBank.findOne({
        slug: payload.slug,
        _id: { $ne: id },
        isDeleted: { $ne: true },
      }).session(session);

      if (existing) {
        throw new AppError(httpStatus.BAD_REQUEST, "Slug already exists");
      }
    }

    payload.updatedBy = user.userId;

    const result = await QuestionBank.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

const deleteQuestionBank = async (id: string, user: JwtPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bank = await QuestionBank.findOne({
      _id: id,
      isDeleted: { $ne: true },
    }).session(session);
    if (!bank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
    }

    if (bank.isDeleted) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Question Bank already deleted",
      );
    }

    const result = await QuestionBank.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.userId,
        updatedBy: user.userId,
      },
      {
        new: true,
        session,
      },
    );

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
export const QuestionBankService = {
  createQuestionBank,
  getAllQuestionBanks,
  getSingleQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
};
