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

const approveSubmission = async (
  submissionId: string,
  adminId: Types.ObjectId,
  reviewComment?: string,
) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const submission =
      await QuestionSubmission.findById(submissionId).session(session);

    if (!submission) {
      throw new AppError(404, "Submission not found");
    }

    if (submission.status !== SubmissionStatus.PENDING) {
      throw new AppError(400, "Submission already reviewed");
    }

    /**
     * ----------------------------------------------------
     * Resolve Chapter
     * ----------------------------------------------------
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
          { session },
        );

        chapterId = chapter._id;
      }
    }

    if (!chapterId) {
      throw new AppError(400, "Chapter not found");
    }

    /**
     * ----------------------------------------------------
     * Resolve Topic
     * ----------------------------------------------------
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
          { session },
        );

        topicId = topic._id;
      }
    }

    if (!topicId) {
      throw new AppError(400, "Topic not found");
    }

    const questionOptions = submission.options.map((option) => ({
      text: option.text,
      image: option.image || "",
      isCorrect: option.label === submission.correctAnswer,
    }));
    /**
     * ----------------------------------------------------
     * NEW Submission
     * ----------------------------------------------------
     */

    let question;

    if (submission.submissionType === SubmissionType.NEW) {
      // [question] = await Question.create(
      //   [
      //     {
      //       subjectId: submission.subjectId,

      //       chapterId,

      //       topicId,

      //       questionText: submission.questionText,

      //       options: questionOptions,

      //       correctAnswer: submission.correctAnswer,

      //       explanation: submission.explanation,

      //       tags: submission.tags,

      //       createdBy: submission.submittedBy,
      //     },
      //   ],
      //   {
      //     session,
      //   },
      // );
    }

    /**
     * ----------------------------------------------------
     * UPDATE Submission
     * ----------------------------------------------------
     */

    if (submission.submissionType === SubmissionType.UPDATE) {
      question = await Question.findByIdAndUpdate(
        submission.existingQuestionId,
        {
          subjectId: submission.subjectId,

          chapterId,

          topicId,

          questionText: submission.questionText,

          options: submission.options,

          correctAnswer: submission.correctAnswer,

          explanation: submission.explanation,

          tags: submission.tags,
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

    /**
     * ----------------------------------------------------
     * Update Submission
     * ----------------------------------------------------
     */

    submission.status = SubmissionStatus.APPROVED;

    submission.reviewedBy = adminId;

    submission.reviewedAt = new Date();

    submission.reviewComment = reviewComment || "";

    submission.chapterId = chapterId;

    submission.topicId = topicId;

    submission.approvedQuestionId = question!._id;

    await submission.save({
      session,
    });

    /**
     * ----------------------------------------------------
     * Reward Contributor
     * ----------------------------------------------------
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

    await session.commitTransaction();

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
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export { approveSubmission };
