import { shuffleArray } from "../../ModelTests/modelTest.utils";


const shuffleQuestions = <T>(questions: T[]) => {
  return shuffleArray(questions);
};

const shuffleOptions = <T>(options: T[]) => {
  return shuffleArray(options);
};

export const ShuffleService = {
  shuffleQuestions,
  shuffleOptions,
};
