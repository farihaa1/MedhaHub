import AppError from "../../../error/AppError";
import { Question } from "../../Questions/question.model";
import { IQuestion } from "../../Questions/question.interface";
import { Types } from "mongoose";

interface ISelectQuestionOptions {
  subjectId?: string;

  chapterId?: string;

  topicIds?: string[];

  source?: string;

  year?: number;

  tags?: string[];

  count: number;
}

const selectQuestions = async (
  options: ISelectQuestionOptions,
): Promise<IQuestion[]> => {
const filter: Record<string, unknown> = {};

if (options.topicIds?.length) {
  filter.topicId = {
    $in: options.topicIds.map((id) => new Types.ObjectId(id)),
  };
}

  if (options.subjectId) {
    filter.subjectId = options.subjectId;
  }

  if (options.chapterId) {
    filter.chapterId = options.chapterId;
  }

  

  if (options.source) {
    filter["examInfo.category"] = options.source;
  }

  if (options.year) {
    filter["examInfo.year"] = options.year;
  }

  if (options.tags?.length) {
    filter.tags = {
      $in: options.tags,
    };
  }
console.log("Filter:", filter);

const total = await Question.countDocuments(filter);

console.log("Matching questions:", total);

  const questions = await Question.aggregate([
    {
      $match: filter,
    },
    {
      $sample: {
        size: options.count,
      },
    },
  ]);

  if (!questions.length) {
    throw new AppError(404, "No questions found for this exam.");
  }

  return questions;
};

export const QuestionSelectorService = {
  selectQuestions,
};
