import { Types } from "mongoose";

import AppError from "../../../error/AppError";

import { Question } from "../../Questions/question.model";

import { IQuestion } from "../../Questions/question.interface";

import { QuestionStatus } from "../../Questions/question.constant";

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
  const filter: Record<string, unknown> = {
    status: QuestionStatus.APPROVED,
  };

  if (options.topicIds?.length) {
    filter.topicId = {
      $in: options.topicIds.map((id) => new Types.ObjectId(id)),
    };
  }

  if (options.subjectId) {
    filter.subjectId = new Types.ObjectId(options.subjectId);
  }

  if (options.chapterId) {
    filter.chapterId = new Types.ObjectId(options.chapterId);
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

  console.log("Exam question filter:", filter);

  const total = await Question.countDocuments(filter);

  console.log("Matching approved questions:", total);

  if (total < options.count) {
    throw new AppError(
      400,
      `Only ${total} approved questions are available, but ${options.count} were requested.`,
    );
  }

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

  return questions as IQuestion[];
};

export const QuestionSelectorService = {
  selectQuestions,
};
