// ============================================================
// USER ROLE
// Must match backend UserRole
// ============================================================

export type UserRole = "admin" | "user" | "premium"

// ============================================================
// USER STATUS
// Must match backend UserStatus
// ============================================================

export type UserStatus = "active" | "blocked" | "deleted"

// ============================================================
// AUTH PROVIDER
// Must match backend AuthProvider
// ============================================================

export type AuthProvider = "credential" | "google"

// ============================================================
// USER
// Matches backend IUser / safeUser response
// ============================================================

export interface IUser {
  _id: string

  name: string

  email: string

  avatar?: string

  googleId?: string

  provider: AuthProvider

  role: UserRole

  status: UserStatus

  isVerified?: boolean

  points?: number

  createdAt?: string

  updatedAt?: string
}

// ============================================================
// LOGIN INPUT
// ============================================================

export interface ILoginInput {
  email: string
  password: string
}

// ============================================================
// REGISTER INPUT
// Backend accepts name/email/password
// ============================================================

export interface RegisterInput {
  name: string
  email: string
  password: string
}

// ============================================================
// GOOGLE LOGIN
// Frontend sends Google ID token to backend
// ============================================================

export interface GoogleLoginInput {
  idToken: string
}

// ============================================================
// CHANGE PASSWORD
// ============================================================

export interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
}

// ============================================================
// SET PASSWORD
// For Google-only accounts
// ============================================================

export interface SetPasswordInput {
  newPassword: string
}

// ============================================================
// UPDATE PROFILE
// Backend uses avatar, NOT profileImage
// ============================================================

export interface UpdateProfileInput {
  name?: string
  avatar?: string
}

// ============================================================
// ADMIN USER UPDATE
// ============================================================

export interface UpdateUserInput {
  name?: string
  email?: string
  role?: UserRole
  avatar?: string
  status?: UserStatus
  isVerified?: boolean
  points?: number
}

// ============================================================
// GENERIC API RESPONSE
// ============================================================

export interface IApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// ============================================================
// AUTH RESPONSE
//
// IMPORTANT:
// Backend returns:
//
// {
//   success: true,
//   message: "...",
//   data: user
// }
//
// Tokens are stored in HttpOnly cookies.
// Therefore there is NO accessToken here.
// ============================================================

export type AuthResponse = IApiResponse<IUser>

// ============================================================
// NULL RESPONSE
// ============================================================

export type NullResponse = IApiResponse<null>

// ============================================================
// AUTH STATE
// ============================================================

export interface IAuthState {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
}
