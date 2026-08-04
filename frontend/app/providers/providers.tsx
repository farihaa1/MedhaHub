"use client"

import ReduxProvider from "../redux/provider"
import AuthProvider from "./AuthProvider"

type ProvidersProps = {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  )
}
