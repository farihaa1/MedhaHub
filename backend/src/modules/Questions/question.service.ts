import mongoose from "mongoose";

import AppError from "../../error/AppError";

import { StatisticsService } from "../services/statistics.service";

import { IQuestion } from "./question.interface";
import { Question } from "./question.model";

import { QuestionStatus } from "./question.constant";

import { UserRole } from "../users/user.constants";

/* =========================================================
   CATEGORY ORDER

   Lower number = higher priority
========================================================= */

const CATEGORY_ORDER = [
  "bcs",
  "ntrca",
  "psc-non-cadre",
  "bank",
  "government",
  "defence",
  "health",
  "admission",
  "teacher",
  "others",
  "custom",
];

/* =========================================================
   CREATE QUESTION
========================================================= */

const createQuestion = async (payload: IQuestion, userRole: UserRole) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* -----------------------------------------
       Backend decides status
    ----------------------------------------- */

    const status =
      userRole === UserRole.ADMIN
        ? QuestionStatus.APPROVED
        : QuestionStatus.PENDING;

    const questionPayload: IQuestion = {
      ...payload,
      status,
    };

    /* -----------------------------------------
       Create question
    ----------------------------------------- */

    const question = await Question.create([questionPayload], {
      session,
    });

    const createdQuestion = question[0];

    /* -----------------------------------------
       Update statistics only for approved
    ----------------------------------------- */

    if (status === QuestionStatus.APPROVED) {
      await StatisticsService.incrementQuestionCount(
        createdQuestion.chapterId.toString(),
        1,
        session,
      );

      await StatisticsService.incrementTopicQuestionCount(
        createdQuestion.topicId.toString(),
        1,
        session,
      );
    }

    await session.commitTransaction();

    return createdQuestion;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

/* =========================================================
   BULK CREATE QUESTIONS
========================================================= */

const bulkCreateQuestions = async (
  payload: IQuestion[],
  userRole: UserRole,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* -----------------------------------------
       Backend decides status
    ----------------------------------------- */

    const status =
      userRole === UserRole.ADMIN
        ? QuestionStatus.APPROVED
        : QuestionStatus.PENDING;

    const questionPayload: IQuestion[] = payload.map((question) => ({
      ...question,
      status,
    }));

    /* -----------------------------------------
       Insert questions
    ----------------------------------------- */

    const questions = await Question.insertMany(questionPayload, {
      session,
      ordered: true,
    });

    /* -----------------------------------------
       Statistics
    ----------------------------------------- */

    if (status === QuestionStatus.APPROVED) {
      const chapterMap = new Map<string, number>();

      const topicMap = new Map<string, number>();

      for (const question of questions) {
        const chapterId = question.chapterId.toString();

        const topicId = question.topicId.toString();

        chapterMap.set(chapterId, (chapterMap.get(chapterId) || 0) + 1);

        topicMap.set(topicId, (topicMap.get(topicId) || 0) + 1);
      }

      /* -----------------------------------------
         Chapter statistics
      ----------------------------------------- */

      for (const [chapterId, count] of chapterMap) {
        await StatisticsService.incrementQuestionCount(
          chapterId,
          count,
          session,
        );
      }

      /* -----------------------------------------
         Topic statistics
      ----------------------------------------- */

      for (const [topicId, count] of topicMap) {
        await StatisticsService.incrementTopicQuestionCount(
          topicId,
          count,
          session,
        );
      }
    }

    await session.commitTransaction();

    return questions;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

/* =========================================================
   GET ALL QUESTIONS
========================================================= */

const getAllQuestions = async (query: Record<string, any>) => {
  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  /* ======================================================
     ACADEMIC FILTERS
  ====================================================== */

  if (query.subjectId && query.subjectId !== "all") {
    filter.subjectId = query.subjectId;
  }

  if (query.chapterId && query.chapterId !== "all") {
    filter.chapterId = query.chapterId;
  }

  if (query.topicId && query.topicId !== "all") {
    filter.topicId = query.topicId;
  }

  /* ======================================================
     METADATA FILTERS
  ====================================================== */

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

  /* ======================================================
     QUESTION SEARCH
  ====================================================== */

  if (typeof query.searchTerm === "string" && query.searchTerm.trim()) {
    filter.questionText = {
      $regex: query.searchTerm.trim(),
      $options: "i",
    };
  }

  /* ======================================================
     SOURCE NAME SEARCH
  ====================================================== */

  if (typeof query.sourceTitle === "string" && query.sourceTitle.trim()) {
    filter.sources = {
      $elemMatch: {
        name: {
          $regex: query.sourceTitle.trim(),
          $options: "i",
        },
      },
    };
  }

  /* ======================================================
     AGGREGATION
  ====================================================== */

  const questions = await Question.aggregate([
    {
      $match: filter,
    },

    /* -----------------------------------------
       Find category ranks
    ----------------------------------------- */

    {
      $addFields: {
        categoryRanks: {
          $map: {
            input: {
              $ifNull: ["$sources", []],
            },

            as: "source",

            in: {
              $indexOfArray: [CATEGORY_ORDER, "$$source.type"],
            },
          },
        },
      },
    },

    /* -----------------------------------------
       Select highest category priority
    ----------------------------------------- */

    {
      $addFields: {
        categoryRank: {
          $let: {
            vars: {
              validRanks: {
                $filter: {
                  input: "$categoryRanks",

                  as: "rank",

                  cond: {
                    $gte: ["$$rank", 0],
                  },
                },
              },
            },

            in: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: "$$validRanks",
                    },
                    0,
                  ],
                },

                {
                  $min: "$$validRanks",
                },

                999,
              ],
            },
          },
        },
      },
    },

    /* -----------------------------------------
       Sort

       1. Category
       2. Question text
       3. Newest
    ----------------------------------------- */

    {
      $sort: {
        categoryRank: 1,
        questionText: 1,
        createdAt: -1,
      },
    },

    {
      $skip: skip,
    },

    {
      $limit: limit,
    },

    /* -----------------------------------------
       Remove internal fields
    ----------------------------------------- */

    {
      $project: {
        categoryRanks: 0,
        categoryRank: 0,
      },
    },
  ]);

  /* ======================================================
     POPULATE
  ====================================================== */

  await Question.populate(questions, [
    {
      path: "subjectId",
      select: "title name slug",
    },

    {
      path: "chapterId",
      select: "title name slug",
    },

    {
      path: "topicId",
      select: "title name slug",
    },

    {
      path: "createdBy",
      select: "name email",
    },

    {
      path: "approvedBy",
      select: "name email",
    },
  ]);

  /* ======================================================
     TOTAL
  ====================================================== */

  const total = await Question.countDocuments(filter);

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

   Publicly returns APPROVED questions only.
========================================================= */

const getQuestionsByTopic = async (topicId: string) => {
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    throw new AppError(400, "Invalid topic ID");
  }

  const questions = await Question.aggregate([
    /* -----------------------------------------
         Filter
      ----------------------------------------- */

    {
      $match: {
        topicId: new mongoose.Types.ObjectId(topicId),

        status: QuestionStatus.APPROVED,
      },
    },

    /* -----------------------------------------
         Category ranks
      ----------------------------------------- */

    {
      $addFields: {
        categoryRanks: {
          $map: {
            input: {
              $ifNull: ["$sources", []],
            },

            as: "source",

            in: {
              $indexOfArray: [CATEGORY_ORDER, "$$source.type"],
            },
          },
        },
      },
    },

    /* -----------------------------------------
         Highest category priority
      ----------------------------------------- */

    {
      $addFields: {
        categoryRank: {
          $let: {
            vars: {
              validRanks: {
                $filter: {
                  input: "$categoryRanks",

                  as: "rank",

                  cond: {
                    $gte: ["$$rank", 0],
                  },
                },
              },
            },

            in: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: "$$validRanks",
                    },
                    0,
                  ],
                },

                {
                  $min: "$$validRanks",
                },

                999,
              ],
            },
          },
        },
      },
    },

    /* -----------------------------------------
         Sort
      ----------------------------------------- */

    {
      $sort: {
        categoryRank: 1,
        questionText: 1,
        createdAt: -1,
      },
    },

    /* -----------------------------------------
         Remove internal fields
      ----------------------------------------- */

    {
      $project: {
        categoryRanks: 0,
        categoryRank: 0,
      },
    },
  ]);

  /* ======================================================
     POPULATE
  ====================================================== */

  await Question.populate(questions, [
    {
      path: "subjectId",
      select: "title name slug",
    },

    {
      path: "chapterId",
      select: "title name slug",
    },

    {
      path: "topicId",
      select: "title name slug",
    },
  ]);

  return questions;
};

/* =========================================================
   GET SINGLE QUESTION
========================================================= */

const getSingleQuestion = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid question ID");
  }

  const question = await Question.findById(id)
    .populate("subjectId", "title name slug")
    .populate("chapterId", "title name slug")
    .populate("topicId", "title name slug")
    .populate("createdBy", "name email")
    .populate("approvedBy", "name email");

  if (!question) {
    throw new AppError(404, "Question not found");
  }

  return question;
};

/* =========================================================
   UPDATE QUESTION
========================================================= */

const updateQuestion = async (
  id: string,
  payload: Partial<IQuestion>,
  user: {
    id: string;
    role: UserRole;
  },
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* -----------------------------------------
       Validate ID
    ----------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid question ID");
    }

    /* -----------------------------------------
       Get old question
    ----------------------------------------- */

    const oldQuestion = await Question.findById(id).session(session);

    if (!oldQuestion) {
      throw new AppError(404, "Question not found");
    }

    /* -----------------------------------------
       USER can only update own question
    ----------------------------------------- */

    if (
      user.role !== UserRole.ADMIN &&
      oldQuestion.createdBy.toString() !== user.id.toString()
    ) {
      throw new AppError(403, "You can only update your own question");
    }

    /* -----------------------------------------
       Protect workflow fields

       Normal USER cannot manipulate:
       createdBy
       approvedBy
       approvedAt
       status
    ----------------------------------------- */

    const updatePayload: Partial<IQuestion> = {
      ...payload,
    };

    delete updatePayload.createdBy;

    if (user.role !== UserRole.ADMIN) {
      delete updatePayload.status;
      delete updatePayload.approvedBy;
      delete updatePayload.approvedAt;
    }

    /* -----------------------------------------
       Old values
    ----------------------------------------- */

    const oldChapterId = oldQuestion.chapterId.toString();

    const oldTopicId = oldQuestion.topicId.toString();

    const oldStatus = oldQuestion.status;

    /* -----------------------------------------
       New values
    ----------------------------------------- */

    const newChapterId = updatePayload.chapterId?.toString() || oldChapterId;

    const newTopicId = updatePayload.topicId?.toString() || oldTopicId;

    const newStatus = updatePayload.status || oldStatus;

    /* -----------------------------------------
       If ADMIN approves question
    ----------------------------------------- */

    if (
      user.role === UserRole.ADMIN &&
      newStatus === QuestionStatus.APPROVED &&
      oldStatus !== QuestionStatus.APPROVED
    ) {
      updatePayload.approvedBy = new mongoose.Types.ObjectId(user.id);

      updatePayload.approvedAt = new Date();
    }

    /* -----------------------------------------
       If ADMIN changes approved -> pending/rejected
    ----------------------------------------- */

    if (
      user.role === UserRole.ADMIN &&
      newStatus !== QuestionStatus.APPROVED &&
      oldStatus === QuestionStatus.APPROVED
    ) {
      updatePayload.approvedBy = undefined;
      updatePayload.approvedAt = undefined;
    }

    /* -----------------------------------------
       Update question
    ----------------------------------------- */

    const question = await Question.findByIdAndUpdate(id, updatePayload, {
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
       CASE 1

       APPROVED -> APPROVED

       Only category changed
    ===================================================== */

    if (wasApproved && isApproved) {
      /* -----------------------------------------
         Chapter changed
      ----------------------------------------- */

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

      /* -----------------------------------------
         Topic changed
      ----------------------------------------- */

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
       CASE 2

       PENDING/REJECTED -> APPROVED
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
       CASE 3

       APPROVED -> PENDING/REJECTED
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
    await session.endSession();
  }
};

/* =========================================================
   DELETE QUESTION
========================================================= */

const deleteQuestion = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* -----------------------------------------
       Validate ID
    ----------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid question ID");
    }

    /* -----------------------------------------
       Find question
    ----------------------------------------- */

    const question = await Question.findById(id).session(session);

    if (!question) {
      throw new AppError(404, "Question not found");
    }

    /* -----------------------------------------
       Delete
    ----------------------------------------- */

    await Question.findByIdAndDelete(id).session(session);

    /* -----------------------------------------
       Update statistics

       Only approved questions count.
    ----------------------------------------- */

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
    await session.endSession();
  }
};

/* =========================================================
   QUESTION STATISTICS
========================================================= */

const getQuestionStats = async () => {
  const startOfToday = new Date();

  startOfToday.setHours(0, 0, 0, 0);

  const [total, approved, pending, rejected, today] = await Promise.all([
    /* -----------------------------------------
       Total
    ----------------------------------------- */

    Question.countDocuments(),

    /* -----------------------------------------
       Approved
    ----------------------------------------- */

    Question.countDocuments({
      status: QuestionStatus.APPROVED,
    }),

    /* -----------------------------------------
       Pending
    ----------------------------------------- */

    Question.countDocuments({
      status: QuestionStatus.PENDING,
    }),

    /* -----------------------------------------
       Rejected
    ----------------------------------------- */

    Question.countDocuments({
      status: QuestionStatus.REJECTED,
    }),

    /* -----------------------------------------
       Created today
    ----------------------------------------- */

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

    // Reserved for future feature
    premium: 0,

    // Reserved for future feature
    reported: 0,

    today,
  };
};

/* =========================================================
   EXPORT
========================================================= */

export const QuestionService = {
  createQuestion,
  bulkCreateQuestions,
  getAllQuestions,
  getQuestionsByTopic,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStats,
};
