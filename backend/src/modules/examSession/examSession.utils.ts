import { ExamSessionStatus } from "./examSession.constant";

export const isSessionRunning = (status: string) =>
  status === ExamSessionStatus.RUNNING;

export const isSessionCompleted = (status: string) =>
  status === ExamSessionStatus.SUBMITTED ||
  status === ExamSessionStatus.EXPIRED;
export const hasSessionExpired = (
  startTime: Date,
  duration: number,
): boolean => {
  const endTime = startTime.getTime() + duration * 60 * 1000;

  return Date.now() >= endTime;
};

export const calculateRemainingTime = (startTime: Date, duration: number) => {
  const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);

  return Math.max(duration * 60 - elapsed, 0);
};