const calculateDuration = (questionCount: number, minutesPerQuestion = 1) => {
  return questionCount * minutesPerQuestion;
};

const calculateRemainingTime = (startTime: Date, duration: number) => {
  const now = new Date();

  const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

  return Math.max(duration * 60 - elapsed, 0);
};

export const TimerService = {
  calculateDuration,
  calculateRemainingTime,
};
