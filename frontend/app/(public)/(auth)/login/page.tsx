import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import LoginForm from "@/app/customComponents/PublicComponents/Login/login-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import AuthBackgroundShape from "@/public/svg/auth-backgrounf-shape"

import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo } = await searchParams

  // if refresh token exists user is probably logged in
  const cookieStore = await cookies()

  const refreshToken = cookieStore.get("refreshToken")

  if (refreshToken) {
    redirect("/dashboard")
  }

  return (
    <div className="relative flex items-center justify-center pt-20">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-10 w-full gap-6 py-6 text-center sm:max-w-lg">
        <CardHeader className="gap-6">
          <CardTitle className="text-2xl font-bold">
            Welcome to MedhaHub
          </CardTitle>

          <CardDescription>
            Sign in to access mock tests, practice sets, previous year
            questions, analytics and leaderboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <LoginForm redirect={redirectTo} />

          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?
            <Link
              href={`/register${
                redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
              }`}
              className="ml-2 font-medium text-primary hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="flex items-center gap-3">
            <Separator />
            <span className="text-sm">OR</span>
            <Separator />
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link
              href={`/login/google${
                redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
              }`}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
