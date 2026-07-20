import mongoose, { Types } from "mongoose";

import AppError from "../../error/AppError";

import { QuestionSubmission } from "./questionSubmission.model";
import { SubmissionStatus } from "./questionSubmission.constant";


import { CONTRIBUTOR_REWARD } from "./questionSubmission.constant";
import { Question } from "../Questions/question.model";
import { User } from "../users/user.model";

const approveSubmission = async (
  submissionId: string,
  adminId: Types.ObjectId,
  reviewComment?: string,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find submission
    const submission =
      await QuestionSubmission.findById(submissionId).session(session);

    if (!submission) {
      throw new AppError(404, "Submission not found");
    }

    if (submission.status !== SubmissionStatus.PENDING) {
      throw new AppError(400, "Submission already reviewed");
    }

    // 1. Create real question

    const [question] = await Question.create(
      [
        {
          subjectId: submission.subjectId,

          chapterId: submission.chapterId,

          topicId: submission.topicId,

          questionText: submission.questionText,

          options: submission.options,

          correctAnswer: submission.correctAnswer,

          explanation: submission.explanation,

          tags: submission.tags,

          createdBy: submission.submittedBy,
        },
      ],
      {
        session,
      },
    );

    // 2. Update submission

    submission.status = SubmissionStatus.APPROVED;

    submission.reviewedBy = adminId;

    submission.reviewedAt = new Date();

    submission.reviewComment = reviewComment || "";

    await submission.save({
      session,
    });

    // 3. Reward contributor

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

    return {
      submission,

      question,

      reward: CONTRIBUTOR_REWARD,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

export { approveSubmission };
