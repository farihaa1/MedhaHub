import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IQuestion } from "../api/questionsApi"


interface QuestionState {
  selectedQuestion: IQuestion | null
}

const initialState: QuestionState = {
  selectedQuestion: null,
}

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setSelectedQuestion(state, action: PayloadAction<IQuestion>) {
      state.selectedQuestion = action.payload
    },

    clearSelectedQuestion(state) {
      state.selectedQuestion = null
    },
  },
})

export const { setSelectedQuestion, clearSelectedQuestion } =
  questionSlice.actions

export default questionSlice.reducer
