import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { Result } from "./result.model";
import { Question } from "../Questions/question.model";
import { ExamSession } from "../examSession/examSession.model";

const createResult = async (sessionId: string) => {
  // Prevent duplicate result
  const exists = await Result.findOne({ sessionId });

  if (exists) {
    return exists;
  }

  const session = await ExamSession.findById(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  let correct = 0;
  let wrong = 0;

  for (const answer of session.answers) {
    const question = await Question.findById(answer.questionId);

    if (!question) continue;

    if (answer.selectedOption === question.correctAnswer) {
      correct++;
    } else {
      wrong++;
    }
  }

  const attempted = session.answers.length;

  const skipped = session.questions.length - attempted;

  const score = correct - wrong * session.negativeMark;

  const accuracy =
    session.questions.length === 0
      ? 0
      : (correct / session.questions.length) * 100;

  const result = await Result.create({
    userId: session.userId,

    sessionId: session._id,

    examType: session.examType,

    totalQuestions: session.questions.length,

    attempted,

    correct,

    wrong,

    skipped,

    score,

    accuracy,

    negativeMark: session.negativeMark,

    submittedAt: session.submittedAt,
  });

  return result;
};

const getResultBySession = async (sessionId: string, userId: string) => {
  const result = await Result.findOne({
    sessionId,
    userId,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Result not found");
  }

  return result;
};

const getMyResults = async (userId: string) => {
  return await Result.find({ userId })
    .sort({ createdAt: -1 })
    .populate("sessionId");
};

export const ResultService = {
  createResult,
  getResultBySession,
  getMyResults,
};
