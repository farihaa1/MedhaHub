import httpStatus from "http-status";
import { HydratedDocument } from "mongoose";

import AppError from "../../../error/AppError";

import { IExamSession } from "../examSession.interface";
import { ExamSessionStatus } from "../examSession.constant";
import { hasSessionExpired } from "../examSession.utils";

type ExamSessionDocument = HydratedDocument<IExamSession>;

const ensureSessionIsRunning = async (session: ExamSessionDocument) => {
  if (
    hasSessionExpired(session.startTime, session.duration) &&
    session.status === ExamSessionStatus.RUNNING
  ) {
    session.status = ExamSessionStatus.EXPIRED;
    session.endTime = new Date();

    await session.save();

    throw new AppError(httpStatus.BAD_REQUEST, "Exam time has expired.");
  }

  if (session.status !== ExamSessionStatus.RUNNING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam is no longer running.");
  }
};

export const SessionValidationService = {
  ensureSessionIsRunning,
};
