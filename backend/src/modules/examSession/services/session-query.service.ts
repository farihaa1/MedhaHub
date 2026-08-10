import mongoose from "mongoose";
import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { ExamSession } from "../examSession.model";

// ============================================================
// GET OWNED SESSION
// ============================================================

const getOwnedSession = async (sessionId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid exam session ID.");
  }

  const session = await ExamSession.findOne({
    _id: sessionId,
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found.");
  }

  return session;
};

// ============================================================
// GET SESSION WITH QUESTIONS
// ============================================================

const getOwnedSessionWithQuestions = async (
  sessionId: string,
  userId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid exam session ID.");
  }

  const session = await ExamSession.findOne({
    _id: sessionId,
    userId: new mongoose.Types.ObjectId(userId),
  }).populate({
    path: "questions.questionId",
    model: "Question",
  });

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found.");
  }

  return session;
};

// ============================================================
// GET ACTIVE SESSION
// ============================================================

/**
 * An active session is one that:
 *
 * 1. belongs to the user
 * 2. matches the exam type
 * 3. has not been submitted
 * 4. has not been ended
 */
const getActiveSession = async (userId: string, examType: string) => {
  const session = await ExamSession.findOne({
    userId: new mongoose.Types.ObjectId(userId),

    examType,

    submittedAt: {
      $exists: false,
    },

    endTime: {
      $exists: false,
    },
  }).sort({
    createdAt: -1,
  });

  return session;
};

export const SessionQueryService = {
  getOwnedSession,

  getOwnedSessionWithQuestions,

  getActiveSession,
};
