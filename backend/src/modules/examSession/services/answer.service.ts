import httpStatus from "http-status";
import { Types, HydratedDocument } from "mongoose";

import AppError from "../../../error/AppError";

import { Question } from "../../Questions/question.model";

import { ISubmitAnswerPayload, IExamSession } from "../examSession.interface";

type ExamSessionDocument = HydratedDocument<IExamSession>;

const saveAnswer = async (
  session: ExamSessionDocument,
  payload: ISubmitAnswerPayload,
) => {
  const question = await Question.findById(payload.questionId);
console.log("ANSWER PAYLOAD", payload);

console.log("QUESTION FOUND", question?._id);
  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found");
  }
  const isCorrect = question.correctAnswer === payload.selectedOption;

  const existingAnswer = session.answers.find(
    (answer) => answer.questionId.toString() === payload.questionId,
  );

  if (existingAnswer) {
    existingAnswer.selectedOption = payload.selectedOption;

    existingAnswer.timeTaken = payload.timeTaken ?? 0;

    existingAnswer.isCorrect = isCorrect;
  } else {
    session.answers.push({
      questionId: question._id as Types.ObjectId,

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
