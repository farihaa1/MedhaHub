import { ExamSession } from "./examSession.model";

interface IUserStatistics {
  totalExams: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  averageAccuracy: number;
}

const generateStatistics = async (userId: string): Promise<IUserStatistics> => {
  const sessions = await ExamSession.find({
    userId,
    status: "submitted",
  });

  let totalQuestions = 0;
  let attempted = 0;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  sessions.forEach((session) => {
    totalQuestions += session.questions.length;

    attempted += session.answers.length;

    const sessionCorrect = session.answers.filter(
      (answer) => answer.isCorrect,
    ).length;

    const sessionWrong = session.answers.filter(
      (answer) => !answer.isCorrect,
    ).length;

    correct += sessionCorrect;

    wrong += sessionWrong;

    skipped += session.questions.length - session.answers.length;
  });

  const averageAccuracy =
    totalQuestions === 0
      ? 0
      : Number(((correct / totalQuestions) * 100).toFixed(2));

  return {
    totalExams: sessions.length,

    totalQuestions,

    attempted,

    correct,

    wrong,

    skipped,

    averageAccuracy,
  };
};

export const StatisticsService = {
  generateStatistics,
};
