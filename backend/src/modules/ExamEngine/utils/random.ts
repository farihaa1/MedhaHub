export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItems = <T>(items: T[], count: number): T[] => {
  const shuffled = [...items].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count);
};
