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

  const redirectQuery = redirectTo
    ? `?redirect=${encodeURIComponent(redirectTo)}`
    : ""

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-6 sm:px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />

        <AuthBackgroundShape className="absolute inset-0 h-full w-full opacity-20 dark:opacity-10" />
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/95 shadow-xl backdrop-blur-sm dark:shadow-black/30">
        <CardHeader className="space-y-2 px-5 pt-5 pb-4 text-center sm:px-7 sm:pt-7">
          <CardTitle className="text-lg font-bold tracking-tight sm:text-xl">
            মেধাহাবে স্বাগতম
          </CardTitle>

          <CardDescription className="text-xs leading-relaxed text-muted-foreground">
            আপনার প্রস্তুতি চালিয়ে যেতে অ্যাকাউন্টে লগইন করুন।
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-5 pb-5 sm:px-7 sm:pb-7">
          <LoginForm redirect={redirectTo} />

          {/* Register */}
          <p className="text-center text-xs text-muted-foreground">
            আপনার কি কোনো অ্যাকাউন্ট নেই?
            <Link
              className="ml-1.5 font-medium text-primary transition-colors hover:underline"
              href={`/register${redirectQuery}`}
            >
              অ্যাকাউন্ট তৈরি করুন
            </Link>
          </p>

        </CardContent>
      </Card>
    </main>
  )
}
