import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAuthState, IUser } from "@/app/features/auth/auth.type"

const initialState: IAuthState = {
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },}
})

export const { setCredentials, clearCredentials,setLoading } = authSlice.actions

export default authSlice.reducer
