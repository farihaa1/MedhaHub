export type UserRole = "student" | "admin" | "teacher"

export interface IUser {
  _id: string
  name: string
  email: string
  role: UserRole
  profileImage?: string
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    user: IUser
  }
}

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
  exp: number
}

export interface ILoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
}

export interface UpdateProfileInput {
  name?: string
  profileImage?: string
}
export interface UpdateUserInput {
  name?: string
  email?: string
  role?: UserRole
  profileImage?: string
  isVerified?: boolean
}
export interface IAuthState {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface IApiResponse<T> {
  success: boolean
  message: string
  data: T
}
export interface LoginData {
  accessToken: string
  refreshToken: string
  user: IUser
}