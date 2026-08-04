import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./slices/authSlice"
import examEngineReducer from "@/app/redux/slices/exam-engine.slice"
import questionFilterReducer from "./slices/questionFilterSlice"
import { baseApi } from "./api/baseApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    examEngine: examEngineReducer,
    questionFilter: questionFilterReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
    }).concat(baseApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
