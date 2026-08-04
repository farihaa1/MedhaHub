import { ClientSession } from "mongoose";
import { Chapter } from "../Chapters/chapter.model";
import { Topic } from "../Topics/topic.model";

/* =========================================================
   TOPIC COUNT
   Number of topics inside a chapter
========================================================= */

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
    {
      session,
    },
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
    {
      session,
    },
  );
};

/* =========================================================
   CHAPTER QUESTION COUNT
========================================================= */

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
    {
      session,
    },
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
    {
      session,
    },
  );
};

/* =========================================================
   TOPIC QUESTION COUNT
========================================================= */

const incrementTopicQuestionCount = async (
  topicId: string,
  count = 1,
  session?: ClientSession,
) => {
  await Topic.findByIdAndUpdate(
    topicId,
    {
      $inc: {
        totalQuestions: count,
      },
    },
    {
      session,
    },
  );
};

const decrementTopicQuestionCount = async (
  topicId: string,
  count = 1,
  session?: ClientSession,
) => {
  await Topic.findByIdAndUpdate(
    topicId,
    {
      $inc: {
        totalQuestions: -count,
      },
    },
    {
      session,
    },
  );
};

export const StatisticsService = {
  incrementTopicCount,
  decrementTopicCount,

  incrementQuestionCount,
  decrementQuestionCount,

  incrementTopicQuestionCount,
  decrementTopicQuestionCount,
};
