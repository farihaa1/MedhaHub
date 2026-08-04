import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import RegisterForm from "@/app/customComponents/PublicComponents/Register/register-form"

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
    <div className="relative flex items-center justify-center pt-20">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-10 w-full max-w-lg gap-6 py-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Create Your Account
          </CardTitle>

          <CardDescription>
            Join MedhaHub and start practicing today.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <RegisterForm redirect={redirectTo} />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?
            <Link
              href={`/login${
                redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
              }`}
              className="ml-2 font-medium text-primary hover:underline"
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
