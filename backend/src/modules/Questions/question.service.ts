import mongoose from "mongoose";
import AppError from "../../error/AppError";
import { StatisticsService } from "../services/statistics.service";
import { IQuestion, IQuestionStats } from "./question.interface";
import { Question } from "./question.model";
import { QuestionStatus } from "./question.constant";

const createQuestion = async (payload: IQuestion) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.create([payload], { session });

    await StatisticsService.incrementQuestionCount(
      payload.chapterId.toString(),
      1,
      session,
    );
    await session.commitTransaction();

    return question[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
const bulkCreateQuestions = async (payload: IQuestion[]) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const questions = await Question.insertMany(payload, {
      session,
      ordered: false,
    });

    // Count how many questions belong to each chapter
    const chapterMap = new Map<string, number>();

    for (const question of payload) {
      const chapterId = question.chapterId.toString();

      chapterMap.set(chapterId, (chapterMap.get(chapterId) || 0) + 1);
    }

    // Update statistics only once per chapter
    for (const [chapter, count] of chapterMap) {
      await StatisticsService.incrementQuestionCount(chapter, count, session);
    }

    await session.commitTransaction();

    return questions;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
const getAllQuestions = async (query: Record<string, any>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  // Academic Filters
  if (query.subjectId && query.subjectId !== "all") {
    filter.subjectId = query.subjectId;
  }

  if (query.chapterId && query.chapterId !== "all") {
    filter.chapterId = query.chapterId;
  }

  if (query.topicId && query.topicId !== "all") {
    filter.topicId = query.topicId;
  }

  // Metadata Filters
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

  // Search
  if (query.searchTerm) {
    filter.questionText = {
      $regex: query.searchTerm,
      $options: "i",
    };
  }

  // Sorting
  const sortField = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .populate("subjectId", "title name")
      .populate("chapterId", "title name")
      .populate("topicId", "title name")
      .sort({
        [sortField]: sortOrder,
      })
      .skip(skip)
      .limit(limit),

    Question.countDocuments(filter),
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

const getQuestionsByTopic = async (topic: string) => {
  const questions = await Question.find({
    topicId: topic,
  });

  return questions;
};

const getSingleQuestion = async (id: string) => {
  const question = await Question.findById(id)
    .populate("subjectId", "title")
    .populate("chapterId", "title")
    .populate("topicId", "title");

  if (!question) {
    throw new AppError(404, "Question not found");
  }

  return question;
};

const updateQuestion = async (id: string, payload: Partial<IQuestion>) => {
  const question = await Question.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    throw new AppError(404, "Question not found");
  }

  return question;
};

const deleteQuestion = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.findByIdAndDelete(id, { session });

    if (!question) {
      throw new AppError(404, "Question not found");
    }
    await StatisticsService.decrementQuestionCount(
      question.chapterId.toString(),
      1,
      session,
    );

    await session.commitTransaction();

    return question;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getQuestionStats = async (): Promise<IQuestionStats> => {
  const startOfToday = new Date();

  startOfToday.setHours(0, 0, 0, 0);

  const [total, approved, pending, rejected, today] = await Promise.all([
    Question.countDocuments(),

    Question.countDocuments({
      status: QuestionStatus.APPROVED,
    }),

    Question.countDocuments({
      status: QuestionStatus.PENDING,
    }),

    Question.countDocuments({
      status: QuestionStatus.REJECTED,
    }),

    Question.countDocuments({
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
export const QuestionService = {
  createQuestion,
  getAllQuestions,
  getQuestionsByTopic,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  getQuestionStats,
};
