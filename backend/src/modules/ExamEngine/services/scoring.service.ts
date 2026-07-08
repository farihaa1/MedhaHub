interface IScoreInput {
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  negativeMark: number;
}

const calculateScore = (data: IScoreInput) => {
  const score = data.correct - data.wrong * data.negativeMark;
  const accuracy = data.total === 0 ? 0 : (data.correct / data.total) * 100;

  return {
    score,
    accuracy,
    correct: data.correct,
    wrong: data.wrong,
    skipped: data.skipped,
  };
};

export const ScoringService = {
  calculateScore,
};
