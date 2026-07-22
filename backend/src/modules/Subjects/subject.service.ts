import AppError from "../../error/AppError";
import { Chapter } from "../Chapters/chapter.model";
import { SubjectSlug } from "./subject.constrain";
import { ISubject } from "./subject.interface";
import { Subject } from "./subject.model";

const createSubject = async (payload: ISubject) => {
  const result = await Subject.create(payload);
  return result;
};

const getAllSubjects = async () => {
  return await Subject.find().sort({ title: 1 });
};

const getSingleSubject = async (slug: SubjectSlug) => {
  return await Subject.findOne({ slug });
};

const updateSubject = async (slug: SubjectSlug, payload: Partial<ISubject>) => {
  return await Subject.findOneAndUpdate({ slug }, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteSubject = async (slug: SubjectSlug) => {
  const chapterCount = await Chapter.countDocuments({ slug: slug});

  if (chapterCount > 0) {
    throw new AppError(
      400,
      "Cannot delete subject because it contains chapters.",
    );
  }
  return await Subject.findOneAndDelete({ slug });
};

export const SubjectService = {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
};
