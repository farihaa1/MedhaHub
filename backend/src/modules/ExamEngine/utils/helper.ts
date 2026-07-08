export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const isEmpty = (value: unknown): boolean => {
  return value === undefined || value === null || value === "";
};
