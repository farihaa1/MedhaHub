// modules/examSession/services/answer.service.ts

import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { Question } from "../../Questions/question.model";

import { ISubmitAnswerPayload, TOptionLabel } from "../examSession.interface";

import { ExamSession } from "../examSession.model";

const OPTION_LABELS: TOptionLabel[] = ["A", "B", "C", "D"];

// ============================================================
// SAVE ANSWER
// ============================================================

const saveAnswer = async (session: any, payload: ISubmitAnswerPayload) => {
  const questionExists = session.questions.some(
    (item: any) => item.questionId.toString() === payload.questionId,
  );

  if (!questionExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This question does not belong to this exam.",
    );
  }

  const question = await Question.findById(payload.questionId)
    .select("options")
    .lean();

  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found.");
  }

  const selectedIndex = OPTION_LABELS.indexOf(payload.selectedOption);

  if (selectedIndex === -1) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid option.");
  }

  const selectedOption = question.options[selectedIndex];

  if (!selectedOption) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Selected option does not exist.",
    );
  }

  const isCorrect = selectedOption.isCorrect === true;

  const existingAnswerIndex = session.answers.findIndex(
    (answer: any) => answer.questionId.toString() === payload.questionId,
  );

  const answer = {
    questionId: payload.questionId,
    selectedOption: payload.selectedOption,
    isCorrect,
    timeTaken: payload.timeTaken ?? 0,
  };

  // ==========================================================
  // UPDATE EXISTING ANSWER
  // ==========================================================

  if (existingAnswerIndex !== -1) {
    session.answers[existingAnswerIndex] = answer;
  } else {
    session.answers.push(answer);
  }

  await session.save();

  return {
    questionId: payload.questionId,
    selectedOption: payload.selectedOption,
    isCorrect,
    timeTaken: payload.timeTaken ?? 0,
  };
};

export const AnswerService = {
  saveAnswer,
};
