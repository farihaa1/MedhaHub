export const generateSlug = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/**
 * Calculate total marks.
 * Assumes each question carries 1 mark.
 */
export const calculateTotalMarks = (questionCount: number): number => {
  return questionCount;
};

/**
 * Check if a model test is currently available.
 */
export const isModelTestAvailable = (
  startDate?: Date,
  endDate?: Date,
): boolean => {
  const now = new Date();

  if (startDate && now < startDate) {
    return false;
  }

  if (endDate && now > endDate) {
    return false;
  }

  return true;
};

/**
 * Shuffle an array using the Fisher-Yates algorithm.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};
