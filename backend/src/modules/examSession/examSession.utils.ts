// modules/examSession/examSession.utils.ts

// ============================================================
// END TIME
// ============================================================

export const calculateEndTime = (startTime: Date, duration: number): Date => {
  return new Date(startTime.getTime() + duration * 60 * 1000);
};

// ============================================================
// EXPIRATION
// ============================================================

export const hasSessionExpired = (
  startTime: Date,
  duration: number,
): boolean => {
  const endTime = calculateEndTime(startTime, duration);

  return Date.now() >= endTime.getTime();
};

// ============================================================
// REMAINING TIME
// ============================================================

export const calculateRemainingTime = (
  startTime: Date,
  duration: number,
): number => {
  const endTime = calculateEndTime(startTime, duration);

  const remainingMilliseconds = endTime.getTime() - Date.now();

  return Math.max(0, Math.ceil(remainingMilliseconds / 1000));
};

// ============================================================
// SESSION COMPLETION
// ============================================================

export const isSessionSubmitted = (submittedAt?: Date): boolean => {
  return Boolean(submittedAt);
};

export const isSessionEnded = (endTime?: Date): boolean => {
  return Boolean(endTime);
};
