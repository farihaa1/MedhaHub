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
      payload.chapter.toString(),
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
      const chapterId = question.chapter.toString();

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
const getAllQuestions = async () => {
  return await Question.find()
    .populate("subject", "title")
    .populate("chapter", "title")
    .populate("topic", "title")
    .sort({ createdAt: -1 });
};

const getQuestionsByTopic = async (topic: string) => {
  const questions = await Question.find({
    topic,
  });

  return questions;
};

const getSingleQuestion = async (id: string) => {
  const question = await Question.findById(id);

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
      question.chapter.toString(),
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
