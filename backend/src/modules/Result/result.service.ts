import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { ExamSession } from "../examSession/examSession.model";

import { Result } from "./result.model";

import { ScoringService } from "../ExamEngine/services/scoring.service";

const createResult = async (sessionId: string) => {
  const session = await ExamSession.findById(sessionId);
  console.log(session);
  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  const totalQuestions = session.questions.length
  const correct = session.answers.filter((answer) => answer.isCorrect).length;
  const attempted = session.answers.length;
  const wrong = attempted - correct;
  const skipped = totalQuestions - attempted;
  const score = ScoringService.calculateScore({
    correct,
    wrong,
    skipped,
    total: totalQuestions,
    negativeMark: session.negativeMark,
  });

  const result = await Result.create({
    sessionId: session._id,
    userId: session.userId,
    totalQuestions,
    attempted,
    correct,
    wrong,
    skipped,
    score: score.score,
    accuracy: score.accuracy,
    negativeMark: session.negativeMark,
  });

  return result;
};

const getResult = async (sessionId: string) => {
  const result = await Result.findOne({
    sessionId,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Result not found");
  }

  return result;
};

export const ResultService = {
  createResult,
  getResult,
};
