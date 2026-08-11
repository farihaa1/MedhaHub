import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ExamSessionQuestion } from "../types/exam.type"


interface ExamEngineState {
  session: ExamSessionQuestion | null
}

const initialState: ExamEngineState = {
  session: null,
}

const examEngineSlice = createSlice({
  name: "examEngine",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<ExamSessionQuestion>) {
      state.session = action.payload
    },

    clearSession(state) {
      state.session = null
    },
  },
})

export const { setSession, clearSession } = examEngineSlice.actions

export default examEngineSlice.reducer
