import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { QuestionDifficulty, QuestionStatus } from "../api/questionsApi"

export interface QuestionFilterState {
  searchTerm: string
  subjectId: string
  chapterId: string
  topicId: string

  difficulty?: QuestionDifficulty
  status?: QuestionStatus

  page: number
  limit: number

  sortBy: string
  sortOrder: "asc" | "desc"
}

const initialState: QuestionFilterState = {
  searchTerm: "",

  subjectId: "",
  chapterId: "",
  topicId: "",

  page: 1,
  limit: 20,

  sortBy: "createdAt",
  sortOrder: "desc",
}

const questionFilterSlice = createSlice({
  name: "questionFilter",

  initialState,

  reducers: {
    setFilters(state, action: PayloadAction<Partial<QuestionFilterState>>) {
      Object.assign(state, action.payload)
    },

    resetFilters() {
      return initialState
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
  },
})

export const { setFilters, resetFilters, setPage } = questionFilterSlice.actions

export default questionFilterSlice.reducer
