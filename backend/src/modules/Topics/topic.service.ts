
import { Topic } from "./topic.model";
import { ITopic } from "./topic.interface";
import AppError from "../../error/AppError";

const createTopic = async (payload: ITopic) => {
  return await Topic.create(payload);
};

const getAllTopics = async () => {
  return await Topic.find()
    .populate("chapterId", "title slug")
    .sort({ order: 1 });
};

const getSingleTopic = async (id: string) => {
  const topic = await Topic.findById(id).populate("chapterId", "title slug");

  if (!topic) {
    throw new AppError(404, "Topic not found");
  }

  return topic;
};

const getTopicsByChapter = async (chapterId: string) => {
  return await Topic.find({ chapterId }).sort({
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
  const topic = await Topic.findByIdAndDelete(id);

  if (!topic) {
    throw new AppError(404, "Topic not found");
  }

  return topic;
};

export const TopicService = {
  createTopic,
  getAllTopics,
  getSingleTopic,
  getTopicsByChapter,
  updateTopic,
  deleteTopic,
};
