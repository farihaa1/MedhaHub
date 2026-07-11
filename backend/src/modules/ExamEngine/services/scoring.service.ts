interface IScoreInput {
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  negativeMark: number;
}

const calculateScore = ({
  correct,
  wrong,
  skipped,
  total,
  negativeMark,
}: IScoreInput) => {
  const score = correct - wrong * negativeMark;

  const accuracy =
    total === 0 ? 0 : Number(((correct / total) * 100).toFixed(2));

  const percentage =
    total === 0 ? 0 : Number(((score / total) * 100).toFixed(2));

  return {
    score,

    percentage,

    accuracy,

    correct,

    wrong,

    skipped,
  };
};

export const ScoringService = {
  calculateScore,
};
