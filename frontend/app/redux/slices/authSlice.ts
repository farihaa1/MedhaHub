import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { IAuthState, IUser } from "../types/auth.type"

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

// ============================================================
// AUTH SLICE
// ============================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // ========================================================
    // SET USER
    // ========================================================

    setCredentials: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },

    // ========================================================
    // CLEAR USER
    // ========================================================

    clearCredentials: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },

    // ========================================================
    // AUTH LOADING
    // ========================================================

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// ============================================================
// ACTIONS
// ============================================================

export const { setCredentials, clearCredentials, setAuthLoading } =
  authSlice.actions

// ============================================================
// REDUCER
// ============================================================

export default authSlice.reducer
