import AppError from "../../error/AppError";
import { IPracticeSet } from "./practiceSet.interface";
import { PracticeSet } from "./practiceSet.model";
import httpStatus from "http-status";

const createPracticeSet = async (payload: IPracticeSet) => {
  const exists = await PracticeSet.findOne({
    $or: [{ title: payload.title }, { slug: payload.slug }],
  });

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, "Practice set already exists.");
  }

  return await PracticeSet.create(payload);
};

const getAllPracticeSets = async () => {
  return await PracticeSet.find()
    .populate("subject")
    .populate("chapter")
    .populate("topics")
    .lean();
};

const getSinglePracticeSet = async (id: string) => {
  const practiceSet = await PracticeSet.findById(id)
    .populate("subject")
    .populate("chapter")
    .populate("topics")
    .populate("questions");

  if (!practiceSet) {
    throw new AppError(httpStatus.NOT_FOUND, "Practice set not found.");
  }

  return practiceSet;
};

const updatePracticeSet = async (
  id: string,
  payload: Partial<IPracticeSet>,
) => {
  const practiceSet = await PracticeSet.findById(id);

  if (!practiceSet) {
    throw new AppError(httpStatus.NOT_FOUND, "Practice set not found.");
  }

  return await PracticeSet.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deletePracticeSet = async (id: string) => {
  const practiceSet = await PracticeSet.findById(id);

  if (!practiceSet) {
    throw new AppError(httpStatus.NOT_FOUND, "Practice set not found.");
  }

  await PracticeSet.findByIdAndDelete(id);

  return null;
};

export const PracticeSetService = {
  createPracticeSet,
  getAllPracticeSets,
  getSinglePracticeSet,
  updatePracticeSet,
  deletePracticeSet,
};
