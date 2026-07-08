import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "@/app/redux/api/authApi"
import { useCurrentUser } from "./useCurrentUser"


export const useAuth = () => {
  const currentUser = useCurrentUser()

  const [login, loginState] = useLoginMutation()
  const [register, registerState] = useRegisterMutation()
  const [logout, logoutState] = useLogoutMutation()

  return {
    user: currentUser.user,
    isAuthenticated: currentUser.isAuthenticated,

    login,
    register,
    logout,

    loginState,
    registerState,
    logoutState,

    refetchUser: currentUser.refetch,
  }
}
