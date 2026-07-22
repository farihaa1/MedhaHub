import { ClientSession } from "mongoose";
import { Chapter } from "../Chapters/chapter.model";

const incrementTopicCount = async (
  chapterId: string,
  count = 1,
  session?: ClientSession,
) => {
  await Chapter.findByIdAndUpdate(
    chapterId,
    {
      $inc: {
        totalTopics: count,
      },
    },
    { session },
  );
};

const decrementTopicCount = async (
  chapterId: string,
  count = 1,
  session?: ClientSession,
) => {
  await Chapter.findByIdAndUpdate(
    chapterId,
    {
      $inc: {
        totalTopics: -count,
      },
    },
    { session },
  );
};

const incrementQuestionCount = async (
  chapterId: string,
  count = 1,
  session?: ClientSession,
) => {
  await Chapter.findByIdAndUpdate(
    chapterId,
    {
      $inc: {
        totalQuestions: count,
      },
    },
    { session },
  );
};

const decrementQuestionCount = async (
  chapterId: string,
  count = 1,
  session?: ClientSession,
) => {
  await Chapter.findByIdAndUpdate(
    chapterId,
    {
      $inc: {
        totalQuestions: -count,
      },
    },
    { session },
  );
};

export const StatisticsService = {
  incrementTopicCount,
  decrementTopicCount,
  incrementQuestionCount,
  decrementQuestionCount,
};
