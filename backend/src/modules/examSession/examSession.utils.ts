import { ExamSessionStatus } from "./examSession.constant";

export const isSessionRunning = (status: string) => {
  return status === ExamSessionStatus.RUNNING;
};

export const isSessionCompleted = (status: string) => {
  return (
    status === ExamSessionStatus.SUBMITTED ||
    status === ExamSessionStatus.EXPIRED
  );
};

export const calculateRemainingTime = (startTime: Date, duration: number) => {
  const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
  const remaining = duration * 60 - elapsed;
  return Math.max(remaining, 0);
};
