import { Question } from "../../Questions/question.model";
import { HydratedDocument } from "mongoose";
import { IExamSession } from "../examSession.interface";
import { ISubmitAnswerPayload } from "../examSession.interface";
import AppError from "../../../error/AppError";
import httpStatus from "http-status";

type ExamSessionDocument = HydratedDocument<IExamSession>;

const saveAnswer = async (
  session: ExamSessionDocument,
  payload: ISubmitAnswerPayload,
) => {
  const question = await Question.findById(payload.questionId);

  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found");
  }

  const optionIndex = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
  }[payload.selectedOption];

  const selectedOption = question.options[optionIndex];

  const isCorrect = selectedOption?.isCorrect ?? false;

  const existingAnswer = session.answers.find(
    (a) => a.questionId.toString() === payload.questionId,
  );

  if (existingAnswer) {
    existingAnswer.selectedOption = payload.selectedOption;
    existingAnswer.isCorrect = isCorrect;
    existingAnswer.timeTaken = payload.timeTaken ?? 0;
  } else {
    session.answers.push({
      questionId: question._id,
      selectedOption: payload.selectedOption,
      isCorrect,
      timeTaken: payload.timeTaken ?? 0,
    });
  }

  await session.save();

  return {
    success: true,
  };
};

export const AnswerService = {
  saveAnswer,
};
