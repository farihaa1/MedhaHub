import httpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import { QuestionBankItem } from "./questionBankItem.model";
import AppError from "../../error/AppError";
import { Question } from "../Questions/question.model";
import { QuestionBank } from "../questionBank/questionBank.model";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../middlewares/QueryBuilder";

const addQuestionToBank = async (
  questionBankId: string,
  payload: {
    question: string;
    order?: number;
    marks?: number;
    negativeMarks?: number;
  },
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /**
     * Check Question Bank
     */

    const bank = await QuestionBank.findById(questionBankId).session(session);

    if (!bank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
    }

    /**
     * Check Question
     */

    const question = await Question.findById(payload.question).session(session);

    if (!question) {
      throw new AppError(httpStatus.NOT_FOUND, "Question not found");
    }

    /**
     * Duplicate Check
     */

    const exists = await QuestionBankItem.findOne({
      questionBank: questionBankId,
      question: payload.question,
    }).session(session);

    if (exists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Question already exists in this Question Bank",
      );
    }

    /**
     * Auto Order
     */

    let order = payload.order;

    if (!order) {
      const last = await QuestionBankItem.findOne({
        questionBank: questionBankId,
      })
        .sort("-order")
        .session(session);

      order = last ? last.order + 1 : 1;
    }

    /**
     * Create Item
     */

    const [item] = await QuestionBankItem.create(
      [
        {
          questionBank: questionBankId,

          question: payload.question,

          order,

          marks: payload.marks,

          negativeMarks: payload.negativeMarks,

          createdBy: user.userId,
        },
      ],
      {
        session,
      },
    );

    /**
     * Update Total Questions
     */

    await QuestionBank.findByIdAndUpdate(
      questionBankId,
      {
        $inc: {
          totalQuestions: 1,
        },
      },
      {
        session,
      },
    );

    await session.commitTransaction();

    return item;
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

const bulkAddQuestions = async (
  questionBankId: string,
  questionIds: string[],
  user: JwtPayload,
) => {
    console.log("bulk add Question,",req.params)
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /**
     * Question Bank
     */

    const bank = await QuestionBank.findById(questionBankId).session(session);

    if (!bank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
    }

    /**
     * Current Last Order
     */

    const last = await QuestionBankItem.findOne({
      questionBank: questionBankId,
    })
      .sort("-order")
      .session(session);

    let order = last ? last.order + 1 : 1;

    /**
     * Existing Questions
     */

    const existing = await QuestionBankItem.find({
      questionBank: questionBankId,

      question: {
        $in: questionIds,
      },
    }).session(session);

    const existingIds = new Set(existing.map((i) => i.question.toString()));

    /**
     * Verify Questions
     */

    const validQuestions = await Question.find({
      _id: {
        $in: questionIds,
      },
    }).session(session);

    const validIds = new Set(validQuestions.map((q) => q._id.toString()));

    /**
     * Build Documents
     */

    const documents = [];

    for (const id of questionIds) {
      if (!validIds.has(id) || existingIds.has(id)) {
        continue;
      }

      documents.push({
        questionBank: questionBankId,

        question: id,

        order: order++,

        createdBy: user.userId,
      });
    }

    if (documents.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "No new questions to add");
    }

    await QuestionBankItem.insertMany(documents, {
      session,
    });

    /**
     * Update Count
     */

    await QuestionBank.findByIdAndUpdate(
      questionBankId,
      {
        $inc: {
          totalQuestions: documents.length,
        },
      },
      {
        session,
      },
    );

    await session.commitTransaction();

    return {
      inserted: documents.length,
    };
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

const syncQuestionBankTotalQuestions = async (
  questionBankId: string,
  session?: mongoose.ClientSession,
) => {
  const total = await QuestionBankItem.countDocuments({
    questionBank: questionBankId,
    isActive: true,
  }).session(session || null);

  await QuestionBank.findByIdAndUpdate(
    questionBankId,
    {
      totalQuestions: total,
    },
    {
      session,
    },
  );
};

const getQuestionsByBank = async (
  questionBankId: string,
  query: Record<string, unknown>,
) => {
  console.log("1", questionBankId);

  const bank = await QuestionBank.findById(questionBankId);

  console.log("2", bank);

  const qb = new QueryBuilder(
    QuestionBankItem.find({
      questionBank: questionBankId,
      isActive: true,
    }).populate({
      path: "question",
      populate: [
        { path: "subject", select: "name" },
        { path: "chapter", select: "name" },
        { path: "topic", select: "name" },
      ],
    }),
    query,
  )
    .sort()
    .paginate()
    .fields();

  console.log("3");

  const data = await qb.modelQuery;

  console.log("4", data.length);

  const meta = await qb.countTotal();

  console.log("5", meta);

  return {
    meta,
    data,
  };
};

const removeQuestionFromBank = async (
  questionBankId: string,
  questionId: string,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /**
     * Check Item
     */

    const item = await QuestionBankItem.findOne({
      questionBank: questionBankId,
      question: questionId,
    }).session(session);

    if (!item) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Question not found in this Question Bank",
      );
    }

    /**
     * Delete Mapping
     */

    await QuestionBankItem.findByIdAndDelete(item._id, {
      session,
    });

    /**
     * Sync Count
     */

    await syncQuestionBankTotalQuestions(questionBankId, session);

    await session.commitTransaction();

    return null;
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

const reorderQuestions = async (
  questionBankId: string,
  items: {
    id: string;
    order: number;
  }[],
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /**
     * Check Question Bank
     */

    const bank = await QuestionBank.findById(questionBankId).session(session);

    if (!bank) {
      throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
    }

    /**
     * Bulk Update
     */

    const operations = items.map((item) => ({
      updateOne: {
        filter: {
          _id: item.id,
          questionBank: questionBankId,
        },
        update: {
          $set: {
            order: item.order,
          },
        },
      },
    }));

    await QuestionBankItem.bulkWrite(operations, {
      session,
    });

    await session.commitTransaction();

    return null;
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

const updateQuestionBankItem = async (
  id: string,
  payload: {
    order?: number;
    marks?: number;
    negativeMarks?: number;
    isActive?: boolean;
  },
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const item = await QuestionBankItem.findById(id).session(session);

    if (!item) {
      throw new AppError(httpStatus.NOT_FOUND, "Question Bank Item not found");
    }

    const result = await QuestionBankItem.findByIdAndUpdate(
      id,
      {
        ...payload,
        updatedBy: user.userId,
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    await session.commitTransaction();

    return result;
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

const getQuestionBankOrThrow = async (id: string) => {
  const bank = await QuestionBank.findById(id);

  if (!bank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
  }

  return bank;
};


export const QuestionBankItemService = {
  addQuestionToBank,
  bulkAddQuestions,
  getQuestionsByBank,
  removeQuestionFromBank,
  reorderQuestions,
  updateQuestionBankItem,
};