import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import { baseApi } from "./api/baseApi"
import examEngineReducer from "@/app/redux/slices/exam-engine.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    examEngine: examEngineReducer,
    questionFilter: questionFilterReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
