import { Types } from "mongoose";
import { Question } from "../../Questions/question.model";

interface IQuestionFilter {
  subjectId?: string;
  chapterId?: string;
  topicIds?: string[];

  source?: string;
  year?: number;

  difficulty?: string[];
  questionType?: string[];

  count: number;
}

const selectQuestions = async (
  filter: IQuestionFilter,
): Promise<Types.ObjectId[]> => {
  const query: Record<string, unknown> = {
    status: "published",
  };

  if (filter.subjectId) {
    query.subjectId = new Types.ObjectId(filter.subjectId);
  }

  if (filter.chapterId) {
    query.chapterId = new Types.ObjectId(filter.chapterId);
  }

  if (filter.topicIds?.length) {
    query.topicId = {
      $in: filter.topicIds.map((id) => new Types.ObjectId(id)),
    };
  }

  if (filter.source) {
    query.source = filter.source;
  }

  if (filter.year) {
    query.year = filter.year;
  }

  if (filter.difficulty?.length) {
    query.difficulty = {
      $in: filter.difficulty,
    };
  }

  if (filter.questionType?.length) {
    query.questionType = {
      $in: filter.questionType,
    };
  }

  const questions: { _id: Types.ObjectId }[] = await Question.aggregate([
    {
      $match: query,
    },
    {
      $sample: {
        size: filter.count,
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ]);

  return questions.map((question) => question._id);
};

export const QuestionSelectorService = {
  selectQuestions,
};
