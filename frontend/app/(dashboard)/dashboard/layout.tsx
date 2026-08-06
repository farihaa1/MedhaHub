import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get("accessToken")

  if (!accessToken) {
    redirect("/login")
  }

  return children
}
