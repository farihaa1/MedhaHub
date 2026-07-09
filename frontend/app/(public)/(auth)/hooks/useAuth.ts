import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "@/app/redux/api/authApi"
import { useCurrentUser } from "./useCurrentUser"


export const useAuth = () => {
  const{ user,isAuthenticated ,refetch,isLoading}= useCurrentUser()

  const [login, loginState] = useLoginMutation()
  const [register, registerState] = useRegisterMutation()
  const [logout, logoutState] = useLogoutMutation()

  return {
    user:user ,
    isAuthenticated: isAuthenticated,

    login,
    register,
    logout,

    loginState,
    registerState,
    logoutState,

    refetchUser:refetch,
  }
}
