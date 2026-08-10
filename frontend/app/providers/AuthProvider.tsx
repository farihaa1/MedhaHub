"use client"

import { ReactNode } from "react"

import { useMeQuery } from "@/app/redux/api/authApi"

interface Props {
  children: ReactNode
}

export default function AuthProvider({ children }: Props) {
  useMeQuery()

  return <>{children}</>
}
