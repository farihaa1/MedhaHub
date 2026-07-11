
import httpStatus from "http-status";
import { ExamSession } from "./examSession.model";
import AppError from "../../error/AppError";
import { ScoringService } from "../ExamEngine/services/scoring.service";


const generateResult = async (sessionId: string) => {
  const session = await ExamSession.findById(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  const totalQuestions = session.questions.length;

  const correct = session.answers.filter((answer) => answer.isCorrect).length;

  const wrong = session.answers.filter((answer) => !answer.isCorrect).length;

  const skipped = totalQuestions - session.answers.length;

  const score = ScoringService.calculateScore({
    correct,
    wrong,
    skipped,
    total: totalQuestions,
    negativeMark: session.negativeMark,
  });

  return {
    totalQuestions,

    attempted: session.answers.length,

    correct,

    wrong,

    skipped,

    score: score.score,

    accuracy: score.accuracy,

    negativeMark: session.negativeMark,
  };
};

export const ResultService = {
  generateResult,
};
