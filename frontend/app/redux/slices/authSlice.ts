import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "@/app/features/auth/auth.type"

interface AuthState {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },

    clearCredentials: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, clearCredentials, setAuthLoading } =
  authSlice.actions

export default authSlice.reducer
