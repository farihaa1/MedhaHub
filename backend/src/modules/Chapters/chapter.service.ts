import { Chapter } from "./chapter.model";
import { IChapter } from "./chapter.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const createChapter = async (payload: IChapter) => {
  return await Chapter.create(payload);
};

const getAllChapters = async () => {
  return await Chapter.find()
    .populate("subjectId", "title slug")
    .sort({ order: 1 });
};

const getSingleChapter = async (id: string) => {
  const chapter = await Chapter.findById(id).populate(
    "subjectId",
    "title slug",
  );

  if (!chapter) {
    throw new AppError(httpStatus.NOT_FOUND, "Chapter not found");
  }

  return chapter;
};

const updateChapter = async (id: string, payload: Partial<IChapter>) => {
  const chapter = await Chapter.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!chapter) {
    throw new AppError(httpStatus.NOT_FOUND, "Chapter not found");
  }

  return chapter;
};

const deleteChapter = async (id: string) => {
  const chapter = await Chapter.findByIdAndDelete(id);

  if (!chapter) {
    throw new AppError(httpStatus.NOT_FOUND, "Chapter not found");
  }

  return chapter;
};

const getChaptersBySubject = async (subjectId: string) => {
  const chapters = await Chapter.find({ subjectId }).sort({ order: 1 });

  if (!chapters.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No chapters found for this subject",
    );
  }

  return chapters;
};

export const ChapterService = {
  createChapter,
  getAllChapters,
  getSingleChapter,
  updateChapter,
  deleteChapter,
  getChaptersBySubject
};
