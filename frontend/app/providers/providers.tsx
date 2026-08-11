"use client"

import ReduxProvider from "../redux/provider"
import AuthProvider from "./AuthProvider"
import GoogleProvider from "./GoogleProvider"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <GoogleProvider>{children}</GoogleProvider>
      </AuthProvider>
    </ReduxProvider>
  )
}
