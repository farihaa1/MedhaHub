import mongoose from "mongoose";
import AppError from "../../error/AppError";
import { StatisticsService } from "../services/statistics.service";
import { IQuestion, IQuestionStats } from "./question.interface";
import { Question } from "./question.model";
import { QuestionStatus } from "./question.constant";

/* =========================================================
   CREATE QUESTION
========================================================= */

const createQuestion = async (payload: IQuestion) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.create([payload], {
      session,
    });

    /*
     * Only approved questions count publicly.
     */
    if (payload.status === QuestionStatus.APPROVED) {
      await StatisticsService.incrementQuestionCount(
        payload.chapterId.toString(),
        1,
        session,
      );

      await StatisticsService.incrementTopicQuestionCount(
        payload.topicId.toString(),
        1,
        session,
      );
    }

    await session.commitTransaction();

    return question[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/* =========================================================
   BULK CREATE QUESTIONS
========================================================= */

const bulkCreateQuestions = async (payload: IQuestion[]) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const questions = await Question.insertMany(payload, {
      session,
      ordered: false,
    });

    const chapterMap = new Map<string, number>();
    const topicMap = new Map<string, number>();

    /*
     * Only approved questions affect public counts.
     */
    for (const question of payload) {
      if (question.status !== QuestionStatus.APPROVED) {
        continue;
      }

      const chapterId = question.chapterId.toString();
      const topicId = question.topicId.toString();

      chapterMap.set(chapterId, (chapterMap.get(chapterId) || 0) + 1);

      topicMap.set(topicId, (topicMap.get(topicId) || 0) + 1);
    }

    /* Chapter counts */

    for (const [chapterId, count] of chapterMap) {
      await StatisticsService.incrementQuestionCount(chapterId, count, session);
    }

    /* Topic counts */

    for (const [topicId, count] of topicMap) {
      await StatisticsService.incrementTopicQuestionCount(
        topicId,
        count,
        session,
      );
    }

    await session.commitTransaction();

    return questions;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/* =========================================================
   GET ALL QUESTIONS
========================================================= */

const getAllQuestions = async (query: Record<string, any>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  /* Academic filters */

  if (query.subjectId && query.subjectId !== "all") {
    filter.subjectId = query.subjectId;
  }

  if (query.chapterId && query.chapterId !== "all") {
    filter.chapterId = query.chapterId;
  }

  if (query.topicId && query.topicId !== "all") {
    filter.topicId = query.topicId;
  }

  /* Metadata filters */

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

  /* Search */

  if (query.searchTerm) {
    filter.questionText = {
      $regex: query.searchTerm,
      $options: "i",
    };
  }

  /* Sorting */

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

/* =========================================================
   GET QUESTIONS BY TOPIC
========================================================= */

const getQuestionsByTopic = async (topicId: string) => {
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    throw new AppError(400, "Invalid topic ID");
  }

  return await Question.find({
    topicId,
    status: QuestionStatus.APPROVED,
  })
    .populate("subjectId", "title")
    .populate("chapterId", "title")
    .populate("topicId", "title")
    .sort({
      createdAt: -1,
    });
};

/* =========================================================
   GET SINGLE QUESTION
========================================================= */

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

/* =========================================================
   UPDATE QUESTION
========================================================= */

const updateQuestion = async (id: string, payload: Partial<IQuestion>) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const oldQuestion = await Question.findById(id).session(session);

    if (!oldQuestion) {
      throw new AppError(404, "Question not found");
    }

    const oldChapterId = oldQuestion.chapterId.toString();

    const oldTopicId = oldQuestion.topicId.toString();

    const oldStatus = oldQuestion.status;

    const newChapterId = payload.chapterId?.toString() || oldChapterId;

    const newTopicId = payload.topicId?.toString() || oldTopicId;

    const newStatus = payload.status || oldStatus;

    const question = await Question.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    if (!question) {
      throw new AppError(404, "Question not found");
    }

    const wasApproved = oldStatus === QuestionStatus.APPROVED;

    const isApproved = newStatus === QuestionStatus.APPROVED;

    /* =====================================================
       CASE 1:
       Approved → Approved
       ===================================================== */

    if (wasApproved && isApproved) {
      if (oldChapterId !== newChapterId) {
        await StatisticsService.decrementQuestionCount(
          oldChapterId,
          1,
          session,
        );

        await StatisticsService.incrementQuestionCount(
          newChapterId,
          1,
          session,
        );
      }

      if (oldTopicId !== newTopicId) {
        await StatisticsService.decrementTopicQuestionCount(
          oldTopicId,
          1,
          session,
        );

        await StatisticsService.incrementTopicQuestionCount(
          newTopicId,
          1,
          session,
        );
      }
    }

    /* =====================================================
       CASE 2:
       Pending/Rejected → Approved
       ===================================================== */

    if (!wasApproved && isApproved) {
      await StatisticsService.incrementQuestionCount(newChapterId, 1, session);

      await StatisticsService.incrementTopicQuestionCount(
        newTopicId,
        1,
        session,
      );
    }

    /* =====================================================
       CASE 3:
       Approved → Pending/Rejected
       ===================================================== */

    if (wasApproved && !isApproved) {
      await StatisticsService.decrementQuestionCount(oldChapterId, 1, session);

      await StatisticsService.decrementTopicQuestionCount(
        oldTopicId,
        1,
        session,
      );
    }

    await session.commitTransaction();

    return question;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/* =========================================================
   DELETE QUESTION
========================================================= */

const deleteQuestion = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.findByIdAndDelete(id, {
      session,
    });

    if (!question) {
      throw new AppError(404, "Question not found");
    }

    /*
     * Only approved questions exist in statistics.
     */
    if (question.status === QuestionStatus.APPROVED) {
      await StatisticsService.decrementQuestionCount(
        question.chapterId.toString(),
        1,
        session,
      );

      await StatisticsService.decrementTopicQuestionCount(
        question.topicId.toString(),
        1,
        session,
      );
    }

    await session.commitTransaction();

    return question;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/* =========================================================
   QUESTION STATS
========================================================= */

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
