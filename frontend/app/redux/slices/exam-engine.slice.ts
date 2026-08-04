import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IExamSession } from "../api/api.type"


interface ExamEngineState {
  session: IExamSession | null
}

const initialState: ExamEngineState = {
  session: null,
}

const examEngineSlice = createSlice({
  name: "examEngine",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<IExamSession>) {
      state.session = action.payload
    },

    clearSession(state) {
      state.session = null
    },
  },
})

export const { setSession, clearSession } = examEngineSlice.actions

export default examEngineSlice.reducer
