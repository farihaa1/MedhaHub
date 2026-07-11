import { RootState } from "../store"


export const selectExamSession = (state: RootState) => state.examEngine.session

export const selectCurrentQuestion = (state: RootState) =>
  state.examEngine.session?.currentQuestion ?? 0
