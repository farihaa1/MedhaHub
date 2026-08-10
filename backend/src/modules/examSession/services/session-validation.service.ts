// modules/examSession/services/session-validation.service.ts

import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { hasSessionExpired } from "../examSession.utils";

const ensureSessionIsRunning = async (session: any) => {
  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found.");
  }

  // ==========================================================
  // ALREADY SUBMITTED
  // ==========================================================

  if (session.submittedAt) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Exam has already been submitted.",
    );
  }

  // ==========================================================
  // ALREADY ENDED
  // ==========================================================

  if (session.endTime) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam has already ended.");
  }

  // ==========================================================
  // TIME EXPIRED
  // ==========================================================

  if (hasSessionExpired(session.startTime, session.duration)) {
    session.endTime = new Date();

    await session.save();

    throw new AppError(httpStatus.BAD_REQUEST, "Exam time has expired.");
  }

  return session;
};

export const SessionValidationService = {
  ensureSessionIsRunning,
};
