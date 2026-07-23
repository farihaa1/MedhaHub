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
     * Prevent Duplicate
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
     * Auto Generate Order
     */
    let order = payload.order;

    if (!order) {
      const lastItem = await QuestionBankItem.findOne({
        questionBank: questionBankId,
      })
        .sort({ order: -1 })
        .session(session);

      order = lastItem ? lastItem.order + 1 : 1;
    }

    /**
     * Create Question Bank Item
     */
    const [item] = await QuestionBankItem.create(
      [
        {
          questionBank: new Types.ObjectId(questionBankId),
          question: new Types.ObjectId(payload.question),
          order,
          marks: payload.marks ?? 1,
          negativeMarks: payload.negativeMarks ?? 0,
          createdBy: new Types.ObjectId(user.id),
        },
      ],
      {
        session,
      },
    );

    /**
     * Sync Total Questions
     */
    await syncQuestionBankTotalQuestions(questionBankId, session);

    await session.commitTransaction();

    return item;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const bulkAddQuestions = async (
  questionBankId: string,
  questionIds: string[],
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
     * Get Last Order
     */
    const lastItem = await QuestionBankItem.findOne({
      questionBank: questionBankId,
    })
      .sort({ order: -1 })
      .session(session);

    let order = lastItem ? lastItem.order + 1 : 1;

    /**
     * Already Existing Questions
     */
    const existingItems = await QuestionBankItem.find({
      questionBank: questionBankId,
      question: { $in: questionIds },
    }).session(session);

    const existingIds = new Set(
      existingItems.map((item) => item.question.toString()),
    );

    /**
     * Verify Question IDs
     */
    const validQuestions = await Question.find({
      _id: { $in: questionIds },
    })
      .select("_id")
      .session(session);

    const validIds = new Set(
      validQuestions.map((question) => question._id.toString()),
    );

    /**
     * Prepare Documents
     */
    const documents: {
      questionBank: Types.ObjectId;
      question: Types.ObjectId;
      order: number;
      marks: number;
      negativeMarks: number;
      createdBy: Types.ObjectId;
    }[] = [];

    for (const questionId of questionIds) {
      if (!validIds.has(questionId)) continue;

      if (existingIds.has(questionId)) continue;

      documents.push({
        questionBank: new Types.ObjectId(questionBankId),
        question: new Types.ObjectId(questionId),
        order: order++,
        marks: 1,
        negativeMarks: 0,
        createdBy: new Types.ObjectId(user.id),
      });
    }

    if (documents.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "No new questions to add");
    }

    /**
     * Insert Items
     */
    await QuestionBankItem.insertMany(documents, {
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
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const syncQuestionBankTotalQuestions = async (
  questionBankId: string,
  session?: mongoose.ClientSession,
): Promise<void> => {
  const totalQuestions = await QuestionBankItem.countDocuments({
    questionBank: new Types.ObjectId(questionBankId),
    isActive: true,
  }).session(session ?? null);

  await QuestionBank.findByIdAndUpdate(
    questionBankId,
    {
      $set: {
        totalQuestions,
      },
    },
    {
      session,
      runValidators: true,
    },
  );
};
const getQuestionsByBank = async (
  questionBankId: string,
  query: Record<string, unknown>,
) => {
  /**
   * Check Question Bank
   */
  const bank = await QuestionBank.findById(questionBankId);

  if (!bank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
  }

  /**
   * Build Query
   */
  const queryBuilder = new QueryBuilder(
    QuestionBankItem.find({
      questionBank: new Types.ObjectId(questionBankId),
      isActive: true,
    }).populate({
      path: "question",
      populate: [
        {
          path: "subject",
          select: "name slug",
        },
        {
          path: "chapter",
          select: "name slug",
        },
        {
          path: "topic",
          select: "name slug",
        },
      ],
    }),
    query,
  )
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

const removeQuestionFromBank = async (
  questionBankId: string,
  questionId: string,
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
     * Check Question Bank Item
     */
    const item = await QuestionBankItem.findOne({
      questionBank: new Types.ObjectId(questionBankId),
      question: new Types.ObjectId(questionId),
    }).session(session);

    if (!item) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Question not found in this Question Bank",
      );
    }

    /**
     * Remove Mapping
     */
    await QuestionBankItem.deleteOne(
      {
        _id: item._id,
      },
      {
        session,
      },
    );

    /**
     * Sync Total Questions
     */
    await syncQuestionBankTotalQuestions(questionBankId, session);

    await session.commitTransaction();

    return null;
  } catch (error) {
    await session.abortTransaction();
    throw error;
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
     * Validate Items
     */
    if (items.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No questions provided for reordering",
      );
    }

    /**
     * Bulk Update Orders
     */
    const operations = items.map((item) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(item.id),
          questionBank: new Types.ObjectId(questionBankId),
          isActive: true,
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
  } catch (error) {
    await session.abortTransaction();
    throw error;
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

    /**
     * Check Item
     */
    const item = await QuestionBankItem.findById(id).session(session);

    if (!item) {
      throw new AppError(httpStatus.NOT_FOUND, "Question Bank Item not found");
    }

    /**
     * Update Item
     */
    const updatedItem = await QuestionBankItem.findByIdAndUpdate(
      id,
      {
        ...payload,
        updatedBy: new Types.ObjectId(user.id),
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    /**
     * Sync Total Questions
     * (Required when isActive changes)
     */
    await syncQuestionBankTotalQuestions(item.questionBank.toString(), session);

    await session.commitTransaction();

    return updatedItem;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
const getQuestionBankOrThrow = async (
  id: string,
  session?: mongoose.ClientSession,
) => {
  const questionBank = await QuestionBank.findById(id).session(session ?? null);

  if (!questionBank) {
    throw new AppError(httpStatus.NOT_FOUND, "Question Bank not found");
  }

  return questionBank;
};


export const QuestionBankItemService = {
  addQuestionToBank,
  bulkAddQuestions,
  getQuestionsByBank,
  removeQuestionFromBank,
  reorderQuestions,
  updateQuestionBankItem,
};