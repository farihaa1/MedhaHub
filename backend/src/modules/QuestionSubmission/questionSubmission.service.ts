import AppError from "../../error/AppError";
import { QuestionSubmission } from "./questionSubmission.model";
import { approveSubmission } from "./approval.service";
import { rejectSubmission } from "./rejection.service";
import {
  IQuestionSubmission,
  TCreateSubmissionPayload,
} from "./questionSubmission.interface";
import { Types } from "mongoose";

const createSubmission = async (
  payload: TCreateSubmissionPayload,
  userId: Types.ObjectId,
) => {
  return await QuestionSubmission.create({
    ...payload,
    submittedBy: userId,
  });
};

const getAllSubmissions = async () => {
  return await QuestionSubmission.find()
    .populate("subjectId")
    .populate("chapterId")
    .populate("topicId")
    .populate("submittedBy")
    .sort({
      createdAt: -1,
    });
};

const getSingleSubmission = async (id: string) => {
 const submission = await QuestionSubmission.findById(id)
   .populate("subjectId")
   .populate("chapterId")
   .populate("topicId")
   .populate("submittedBy")
   .populate("reviewedBy");

  if (!submission) {
    throw new AppError(404, "Submission not found");
  }

  return submission;
};

const deleteSubmission = async (id: string) => {
  const submission = await QuestionSubmission.findByIdAndDelete(id);

  if (!submission) {
    throw new AppError(404, "Submission not found");
  }

  return submission;
};

export const QuestionSubmissionService = {
  createSubmission,

  getAllSubmissions,

  getSingleSubmission,

  deleteSubmission,

  approveSubmission,

  rejectSubmission,
};
