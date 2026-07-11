import { Types } from "mongoose";
import httpStatus from "http-status";
import { ExamSession } from "./examSession.model";
import AppError from "../../error/AppError";
import { Question } from "../Questions/question.model";


interface ISaveAnswerPayload {
  sessionId: string;
  questionId: string;
  selectedOption: "A" | "B" | "C" | "D";
  timeTaken?: number;
}

const saveAnswer = async (payload: ISaveAnswerPayload) => {
  const session = await ExamSession.findById(payload.sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  const question = await Question.findById(payload.questionId);

  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found");
  }

  const exists = session.questions.some(
    (q) => q.questionId.toString() === payload.questionId,
  );

  if (!exists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Question does not belong to this exam.",
    );
  }

  const isCorrect = question.correctAnswer === payload.selectedOption;

  const answerIndex = session.answers.findIndex(
    (a) => a.questionId.toString() === payload.questionId,
  );

  if (answerIndex >= 0) {
    session.answers[answerIndex].selectedOption = payload.selectedOption as any;
    session.answers[answerIndex].isCorrect = isCorrect;
    session.answers[answerIndex].timeTaken = payload.timeTaken ?? 0;
  } else {
    session.answers.push({
      questionId: new Types.ObjectId(payload.questionId),
      selectedOption: payload.selectedOption as any,
      isCorrect,
      timeTaken: payload.timeTaken ?? 0,
    });
  }

  await session.save();

  return session.answers;
};

export const AnswerService = {
  saveAnswer,
};
