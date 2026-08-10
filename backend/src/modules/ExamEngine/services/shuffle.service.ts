import { shuffleArray } from "../../ModelTests/modelTest.utils";

const shuffleQuestions = <T>(questions: T[]): T[] => {
  return shuffleArray(questions);
};

const shuffleOptions = <T>(options: T[]): T[] => {
  return shuffleArray(options);
};

export const ShuffleService = {
  shuffleQuestions,

  shuffleOptions,
};
