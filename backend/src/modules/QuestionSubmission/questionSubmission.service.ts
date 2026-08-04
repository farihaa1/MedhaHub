import { Types } from "mongoose";

import AppError from "../../error/AppError";

import { QuestionSubmission } from "./questionSubmission.model";

import {
  IQuestionSubmission,
  TCreateSubmissionPayload,
} from "./questionSubmission.interface";

import { approveSubmission } from "./approval.service";
import { rejectSubmission } from "./rejection.service";

import { SubmissionStatus } from "./questionSubmission.constant";

const createSubmission = async (
  payload: TCreateSubmissionPayload,
  userId: Types.ObjectId,
) => {
  const submission = await QuestionSubmission.create({
    ...payload,
    submittedBy: userId,
  });

  return submission.populate([
    "subjectId",
    "chapterId",
    "topicId",
    "submittedBy",
  ]);
};

/**
 * ---------------------------------------
 * Admin
 * ---------------------------------------
 */

const getAllSubmissions = async (query: Record<string, any>) => {
const filter: Record<string, any> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.submittedBy) {
    filter.submittedBy = query.submittedBy;
  }

  if (query.subjectId) {
    filter.subjectId = query.subjectId;
  }

  if (query.submissionType) {
    filter.submissionType = query.submissionType;
  }

  const submissions = await QuestionSubmission.find(filter)
    .populate("subjectId")
    .populate("chapterId")
    .populate("topicId")
    .populate("submittedBy")
    .populate("reviewedBy")
    .populate("approvedQuestionId")
    .sort({
      createdAt: -1,
    });

  return submissions;
};

/**
 * ---------------------------------------
 * User
 * ---------------------------------------
 */

const getMySubmissions = async (userId: Types.ObjectId) => {
  return QuestionSubmission.find({
    submittedBy: userId,
  })
    .populate("subjectId")
    .populate("chapterId")
    .populate("topicId")
    .populate("reviewedBy")
    .populate("approvedQuestionId")
    .sort({
      createdAt: -1,
    });
};

/**
 * ---------------------------------------
 * Single
 * ---------------------------------------
 */

const getSingleSubmission = async (id: string) => {
  const submission = await QuestionSubmission.findById(id)
    .populate("subjectId")
    .populate("chapterId")
    .populate("topicId")
    .populate("submittedBy")
    .populate("reviewedBy")
    .populate("approvedQuestionId")
    .populate("existingQuestionId");

  if (!submission) {
    throw new AppError(404, "Submission not found");
  }

  return submission;
};

/**
 * ---------------------------------------
 * Delete
 * ---------------------------------------
 */

const deleteSubmission = async (id: string) => {
  const submission = await QuestionSubmission.findById(id);

  if (!submission) {
    throw new AppError(404, "Submission not found");
  }

  if (submission.status === SubmissionStatus.APPROVED) {
    throw new AppError(400, "Approved submission cannot be deleted");
  }

  await submission.deleteOne();

  return null;
};

export const QuestionSubmissionService = {
  createSubmission,

  getAllSubmissions,

  getMySubmissions,

  getSingleSubmission,

  deleteSubmission,

  approveSubmission,

  rejectSubmission,
};
