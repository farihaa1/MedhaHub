import mongoose from "mongoose";
import { Topic } from "./topic.model";
import { ITopic } from "./topic.interface";
import AppError from "../../error/AppError";
import { StatisticsService } from "../services/statistics.service";

const createTopic = async (payload: ITopic) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const topic = await Topic.create([payload], { session });

    await StatisticsService.incrementTopicCount(
      payload.chapter.toString(),
      1,
      session,
    );

    await session.commitTransaction();

    return topic[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllTopics = async () => {
  return await Topic.find()
    .populate("chapter", "title slug")
    .populate("subject", "title slug")
    .sort({ order: 1 });
};

const getSingleTopic = async (id: string) => {
  const topic = await Topic.findById(id)
    .populate("chapter", "title slug")
    .populate("subject", "title slug");

  if (!topic) {
    throw new AppError(404, "Topic not found");
  }

  return topic;
};

const getTopicsByChapter = async (chapterId: string) => {
  return await Topic.find({ chapter: chapterId }).sort({
    order: 1,
  });
};

const updateTopic = async (id: string, payload: Partial<ITopic>) => {
  const topic = await Topic.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!topic) {
    throw new AppError(404, "Topic not found");
  }

  return topic;
};

const deleteTopic = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const topic = await Topic.findByIdAndDelete(id, { session });

    if (!topic) {
      throw new AppError(404, "Topic not found");
    }

    await StatisticsService.decrementTopicCount(
      topic.chapter.toString(),
      1,
      session,
    );

    await session.commitTransaction();

    return topic;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const createBulkTopics = async (payload: ITopic[]) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Topic.insertMany(payload, {
      session,
    });

    // update chapter counts
    const chapterMap = new Map<string, number>();

    payload.forEach((topic) => {
      const id = topic.chapter.toString();

      chapterMap.set(id, (chapterMap.get(id) || 0) + 1);
    });

    for (const [chapter, count] of chapterMap) {
      await StatisticsService.incrementTopicCount(chapter, count, session);
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
const moveTopic = async (topicId: string, chapterId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const topic = await Topic.findById(topicId).session(session);

    if (!topic) {
      throw new AppError(404, "Topic not found");
    }

    const oldChapter = topic.chapter.toString();

    topic.chapter = new mongoose.Types.ObjectId(chapterId);

    await topic.save({ session });

    await StatisticsService.decrementTopicCount(oldChapter, 1, session);

    await StatisticsService.incrementTopicCount(chapterId, 1, session);

    await session.commitTransaction();

    return topic;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
import { Question } from "../Questions/question.model";

const mergeTopics = async (sourceTopicId: string, targetTopicId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const source = await Topic.findById(sourceTopicId).session(session);

    const target = await Topic.findById(targetTopicId).session(session);

    if (!source) {
      throw new AppError(404, "Source topic not found");
    }

    if (!target) {
      throw new AppError(404, "Target topic not found");
    }

    await Question.updateMany(
      {
        topic: source._id,
      },
      {
        topic: target._id,
        chapter: target.chapter,
        subject: target.subject,
      },
      {
        session,
      },
    );

    target.totalQuestions += source.totalQuestions;

    await target.save({ session });

    await Topic.findByIdAndDelete(source._id, {
      session,
    });

    await StatisticsService.decrementTopicCount(
      source.chapter.toString(),
      1,
      session,
    );

    await session.commitTransaction();

    return target;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const TopicService = {
  createTopic,
  getAllTopics,
  getSingleTopic,
  getTopicsByChapter,
  updateTopic,
  deleteTopic,
  createBulkTopics,
  moveTopic,
  mergeTopics
};
