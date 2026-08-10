import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { ExamSession } from "../examSession/examSession.model";
import { ExamSessionStatus } from "../examSession/examSession.constant";

import { Result } from "./result.model";

import { Question } from "../Questions/question.model";

// ============================================================
// OPTION LABELS
// ============================================================

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ============================================================
// CREATE RESULT
// ============================================================

const createResult = async (sessionId: string) => {
  // ----------------------------------------------------------
  // Find session
  // ----------------------------------------------------------

  const session = await ExamSession.findById(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found.");
  }

  // ----------------------------------------------------------
  // Check session status
  // ----------------------------------------------------------

  if (
    session.status !== ExamSessionStatus.SUBMITTED &&
    session.status !== ExamSessionStatus.EXPIRED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam has not been submitted.");
  }

  // ----------------------------------------------------------
  // Calculate statistics
  // ----------------------------------------------------------

  const totalQuestions = session.questions.length;

  const attempted = session.answers.length;

  const correct = session.answers.filter(
    (answer) => answer.isCorrect === true,
  ).length;

  const wrong = session.answers.filter(
    (answer) => answer.isCorrect === false,
  ).length;

  const skipped = Math.max(0, totalQuestions - attempted);

  // ----------------------------------------------------------
  // Calculate score
  // ----------------------------------------------------------

  const score = correct - wrong * session.negativeMark;

  // ----------------------------------------------------------
  // Calculate accuracy
  // ----------------------------------------------------------

  const accuracy =
    attempted === 0 ? 0 : Number(((correct / attempted) * 100).toFixed(2));

  // ----------------------------------------------------------
  // Create / Update Result
  // ----------------------------------------------------------

  const result = await Result.findOneAndUpdate(
    {
      sessionId: session._id,
    },
    {
      sessionId: session._id,

      userId: session.userId,

      totalQuestions,

      attempted,

      correct,

      wrong,

      skipped,

      score,

      accuracy,

      negativeMark: session.negativeMark,
    },
    {
      new: true,

      upsert: true,

      setDefaultsOnInsert: true,
    },
  );

  // ----------------------------------------------------------
  // Persist result inside session
  // ----------------------------------------------------------

  session.result = {
    score,
    correct,
    wrong,
    skipped,
    accuracy,
  };

  await session.save();

  return result;
};

// ============================================================
// RESULT REVIEW
// ============================================================

const getResultReview = async (sessionId: string, userId: string) => {
  // ----------------------------------------------------------
  // Get session
  // ----------------------------------------------------------

  const session = await ExamSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found.");
  }

  // ----------------------------------------------------------
  // Check exam status
  // ----------------------------------------------------------

  if (
    session.status !== ExamSessionStatus.SUBMITTED &&
    session.status !== ExamSessionStatus.EXPIRED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Exam has not been submitted yet.",
    );
  }

  // ----------------------------------------------------------
  // Get result
  // ----------------------------------------------------------

  let result = await Result.findOne({
    sessionId,
    userId,
  });

  // ----------------------------------------------------------
  // Safety fallback
  //
  // If result was not created during submit,
  // create it now.
  // ----------------------------------------------------------

  if (!result) {
    result = await createResult(sessionId);
  }

  // ----------------------------------------------------------
  // Get question IDs
  // ----------------------------------------------------------

  const questionIds = session.questions.map((question) => question.questionId);

  // ----------------------------------------------------------
  // Get questions
  // ----------------------------------------------------------

  const questions = await Question.find({
    _id: {
      $in: questionIds,
    },
  })
    .select("questionText questionImage options explanation explanationImage")
    .lean();

  // ----------------------------------------------------------
  // Answer map
  // ----------------------------------------------------------

  const answerMap = new Map(
    session.answers.map((answer) => [answer.questionId.toString(), answer]),
  );

  // ----------------------------------------------------------
  // Question map
  // ----------------------------------------------------------

  const questionMap = new Map(
    questions.map((question) => [question._id.toString(), question]),
  );

  // ----------------------------------------------------------
  // Build review questions
  // ----------------------------------------------------------

  const reviewQuestions = session.questions
    .map((sessionQuestion) => {
      const question = questionMap.get(sessionQuestion.questionId.toString());

      if (!question) {
        return null;
      }

      const answer = answerMap.get(sessionQuestion.questionId.toString());

      // --------------------------------------------------
      // Correct option
      // --------------------------------------------------

      const correctIndex = question.options.findIndex(
        (option) => option.isCorrect === true,
      );

      const correctOption =
        correctIndex >= 0 ? OPTION_LABELS[correctIndex] : undefined;

      // --------------------------------------------------
      // Review question
      // --------------------------------------------------

      return {
        id: question._id.toString(),

        order: sessionQuestion.order,

        questionText: question.questionText,

        questionImage: question.questionImage ?? undefined,

        options: question.options.map((option, index) => ({
          label: OPTION_LABELS[index],

          text: option.text,

          image: option.image ?? undefined,

          isCorrect: option.isCorrect,
        })),

        selectedOption: answer?.selectedOption,

        correctOption,

        isCorrect: answer?.isCorrect ?? false,

        explanation: question.explanation,

        explanationImage: question.explanationImage ?? undefined,
      };
    })
    .filter(
      (question): question is NonNullable<typeof question> => question !== null,
    );

  // ----------------------------------------------------------
  // Return
  // ----------------------------------------------------------

  return {
    result: {
      totalQuestions: result.totalQuestions,

      attempted: result.attempted,

      correct: result.correct,

      wrong: result.wrong,

      skipped: result.skipped,

      score: result.score,

      accuracy: result.accuracy,

      negativeMark: result.negativeMark,

      status: session.status,
    },

    questions: reviewQuestions,
  };
};

// ============================================================
// EXPORT
// ============================================================

export const ResultService = {
  createResult,
  getResultReview,
};
