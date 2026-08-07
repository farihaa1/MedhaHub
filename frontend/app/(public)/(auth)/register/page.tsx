import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

import RegisterForm from "@/app/customComponents/PublicComponents/Register/register-form"

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

interface RegisterPageProps {
  searchParams: Promise<{
    redirect?: string
  }>
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { redirect: redirectTo } = await searchParams

  const cookieStore = await cookies()

  if (cookieStore.get("refreshToken")) {
    redirect("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <AuthBackgroundShape />

      <Card className="z-10 w-full max-w-lg gap-6 py-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Create Your Account
          </CardTitle>

          <CardDescription>
            Join MedhaHub and start learning today.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <RegisterForm redirect={redirectTo} />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?
            <Link
              className="ml-2 font-medium text-primary hover:underline"
              href={`/login${
                redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
              }`}
            >
              Sign In
            </Link>
          </p>

          <div className="flex items-center gap-3">
            <Separator />
            <span className="text-sm">OR</span>
            <Separator />
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link
              href={`/register/google${
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
