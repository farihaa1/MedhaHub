import mongoose, { Types } from "mongoose";

import AppError from "../../error/AppError";

import { QuestionSubmission } from "./questionSubmission.model";

import {
  CONTRIBUTOR_REWARD,
  SubmissionStatus,
  SubmissionType,
} from "./questionSubmission.constant";

import { Question } from "../Questions/question.model";

import { User } from "../users/user.model";

import { Chapter } from "../Chapters/chapter.model";

import { Topic } from "../Topics/topic.model";
import DuplicateDetectorService from "../duplicateDetector/duplicateDetector.service";

const approveSubmission = async (
  submissionId: string,
  adminId: Types.ObjectId,
  reviewComment?: string,
) => {
  const session = await mongoose.startSession();

  let approvedQuestionId: Types.ObjectId | undefined;

  try {
    await session.startTransaction();

    /**
     * ==========================================================
     * FIND SUBMISSION
     * ==========================================================
     */

    const submission =
      await QuestionSubmission.findById(submissionId).session(session);

    if (!submission) {
      throw new AppError(404, "Submission not found");
    }

    if (submission.status !== SubmissionStatus.PENDING) {
      throw new AppError(400, "Submission already reviewed");
    }

    /**
     * ==========================================================
     * RESOLVE CHAPTER
     * ==========================================================
     */

    let chapterId = submission.chapterId;

    if (!chapterId && submission.suggestedChapterTitle) {
      const existingChapter = await Chapter.findOne({
        subjectId: submission.subjectId,
        title: submission.suggestedChapterTitle,
      }).session(session);

      if (existingChapter) {
        chapterId = existingChapter._id;
      } else {
        const [chapter] = await Chapter.create(
          [
            {
              subjectId: submission.subjectId,

              title: submission.suggestedChapterTitle,
            },
          ],
          {
            session,
          },
        );

        chapterId = chapter._id;
      }
    }

    if (!chapterId) {
      throw new AppError(400, "Chapter not found");
    }

    /**
     * ==========================================================
     * RESOLVE TOPIC
     * ==========================================================
     */

    let topicId = submission.topicId;

    if (!topicId && submission.suggestedTopicTitle) {
      const existingTopic = await Topic.findOne({
        chapterId,
        title: submission.suggestedTopicTitle,
      }).session(session);

      if (existingTopic) {
        topicId = existingTopic._id;
      } else {
        const [topic] = await Topic.create(
          [
            {
              chapterId,
              title: submission.suggestedTopicTitle,
            },
          ],
          {
            session,
          },
        );

        topicId = topic._id;
      }
    }

    if (!topicId) {
      throw new AppError(400, "Topic not found");
    }

    /**
     * ==========================================================
     * CONVERT OPTIONS
     *
     * Submission:
     *
     * {
     *   label: "A",
     *   text: "..."
     * }
     *
     * Question:
     *
     * {
     *   text: "...",
     *   isCorrect: true
     * }
     * ==========================================================
     */

    const questionOptions = submission.options.map((option) => ({
      text: option.text,

      image: option.image || null,

      isCorrect: option.label === submission.correctAnswer,
    }));

    /**
     * ==========================================================
     * NEW QUESTION
     * ==========================================================
     */

    let question;

    if (submission.submissionType === SubmissionType.NEW) {
      const [createdQuestion] = await Question.create(
        [
          {
            subjectId: submission.subjectId,

            chapterId,

            topicId,

            questionText: submission.questionText,

            options: questionOptions,

            explanation: submission.explanation || "",

            tags: submission.tags || [],

            createdBy: submission.submittedBy,

            approvedBy: adminId,

            approvedAt: new Date(),
          },
        ],
        {
          session,
        },
      );

      question = createdQuestion;
    }

    /**
     * ==========================================================
     * UPDATE QUESTION
     * ==========================================================
     */

    if (submission.submissionType === SubmissionType.UPDATE) {
      if (!submission.existingQuestionId) {
        throw new AppError(400, "Existing question ID is required");
      }

      question = await Question.findByIdAndUpdate(
        submission.existingQuestionId,

        {
          $set: {
            subjectId: submission.subjectId,

            chapterId,

            topicId,

            questionText: submission.questionText,

            options: questionOptions,

            explanation: submission.explanation || "",

            tags: submission.tags || [],

            approvedBy: adminId,

            approvedAt: new Date(),
          },
        },

        {
          new: true,

          runValidators: true,

          session,
        },
      );

      if (!question) {
        throw new AppError(404, "Question not found");
      }
    }

    if (!question) {
      throw new AppError(500, "Question could not be created or updated");
    }

    approvedQuestionId = question._id;

    /**
     * ==========================================================
     * UPDATE SUBMISSION
     * ==========================================================
     */

    submission.status = SubmissionStatus.APPROVED;

    submission.reviewedBy = adminId;

    submission.reviewedAt = new Date();

    submission.reviewComment = reviewComment || "";

    submission.chapterId = chapterId;

    submission.topicId = topicId;

    submission.approvedQuestionId = question._id;

    await submission.save({
      session,
    });

    /**
     * ==========================================================
     * REWARD CONTRIBUTOR
     * ==========================================================
     */

    await User.findByIdAndUpdate(
      submission.submittedBy,

      {
        $inc: {
          points: CONTRIBUTOR_REWARD,
        },
      },

      {
        session,
      },
    );

    /**
     * ==========================================================
     * COMMIT DATABASE TRANSACTION
     * ==========================================================
     */

    await session.commitTransaction();

    /**
     * ==========================================================
     * DUPLICATE DETECTION
     *
     * We intentionally run this AFTER the transaction.
     *
     * DuplicateDetector uses its own database operations.
     * ==========================================================
     */

    let duplicateDetection = null;

    try {
      duplicateDetection = await DuplicateDetectorService.indexQuestion(
        question._id.toString(),
      );
    } catch (duplicateError) {
      console.error("Duplicate detection failed:", duplicateError);

      duplicateDetection = {
        error: "Duplicate detection failed after approval",
      };
    }

    /**
     * ==========================================================
     * POPULATE
     * ==========================================================
     */

    await submission.populate([
      {
        path: "subjectId",
      },

      {
        path: "chapterId",
      },

      {
        path: "topicId",
      },

      {
        path: "submittedBy",
      },

      {
        path: "reviewedBy",
      },

      {
        path: "approvedQuestionId",
      },
    ]);

    return {
      success: true,

      reward: CONTRIBUTOR_REWARD,

      submission,

      question,

      duplicateDetection,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export { approveSubmission };
