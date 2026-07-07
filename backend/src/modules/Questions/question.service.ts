import AppError from "../../error/AppError";
import { IQuestion } from "./question.interface";
import { Question } from "./question.model";

const createQuestion = async (payload: IQuestion) => {
  const question = await Question.create(payload);

  return question;
};

const getAllQuestions = async () => {
  return await Question.find();
};

const getQuestionsByTopic = async (topicId: string) => {
  const questions = await Question.find({
    topicId,
  });

  return questions;
};

const getSingleQuestion = async (id: string) => {
  const question = await Question.findById(id);

  if (!question) {
    throw new AppError(404, "Question not found");
  }

  return question;
};

const updateQuestion = async (id: string, payload: Partial<IQuestion>) => {
  const question = await Question.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    throw new AppError(404, "Question not found");
  }

  return question;
};

const deleteQuestion = async (id: string) => {
  const question = await Question.findByIdAndDelete(id);

  if (!question) {
    throw new AppError(404, "Question not found");
  }

  return question;
};

export const QuestionService = {
  createQuestion,
  getAllQuestions,
  getQuestionsByTopic,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
