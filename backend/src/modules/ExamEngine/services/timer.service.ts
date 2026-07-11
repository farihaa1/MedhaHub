interface ICalculateDurationOptions {
  minutePerQuestion?: number;
  minimumDuration?: number;
}

const calculateDuration = (
  questionCount: number,
  options?: ICalculateDurationOptions,
): number => {
  const minutePerQuestion = options?.minutePerQuestion ?? 1;
  const minimumDuration = options?.minimumDuration ?? 10;

  const duration = questionCount * minutePerQuestion;

  return Math.max(duration, minimumDuration);
};

const calculateRemainingTime = (startTime: Date, duration: number): number => {
  const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);

  const remainingSeconds = duration * 60 - elapsedSeconds;

  return Math.max(remainingSeconds, 0);
};

const isExpired = (startTime: Date, duration: number): boolean => {
  return calculateRemainingTime(startTime, duration) <= 0;
};

export const TimerService = {
  calculateDuration,
  calculateRemainingTime,
  isExpired,
};
