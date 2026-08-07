import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

import LoginForm from "@/app/customComponents/PublicComponents/Login/login-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import AuthBackgroundShape from "@/public/svg/auth-backgrounf-shape"

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo } = await searchParams

  const cookieStore = await cookies()

  // User already has a refresh token
  if (cookieStore.get("refreshToken")) {
    redirect("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <AuthBackgroundShape />

      <Card className="z-10 w-full max-w-lg gap-6 py-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to MedhaHub
          </CardTitle>

          <CardDescription>
            Sign in to continue your preparation.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <LoginForm redirect={redirectTo} />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?
            <Link
              className="ml-2 font-medium text-primary hover:underline"
              href={`/register${
                redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
              }`}
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
