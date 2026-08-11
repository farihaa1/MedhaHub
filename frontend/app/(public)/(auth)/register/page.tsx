
import Link from "next/link"

import RegisterForm from "@/app/customComponents/PublicComponents/Register/register-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

  const redirectQuery = redirectTo
    ? `?redirect=${encodeURIComponent(redirectTo)}`
    : ""

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-8">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />

        <AuthBackgroundShape className="absolute inset-0 h-full w-full opacity-20 dark:opacity-10" />
      </div>

      {/* Register Card */}

      <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/95 shadow-xl backdrop-blur-sm dark:shadow-black/30">
        <CardHeader className="space-y-2 px-5 pb-4 pt-5 text-center sm:px-7 sm:pb-4 sm:pt-7">
          <CardTitle className="text-lg font-bold tracking-tight sm:text-xl">
            অ্যাকাউন্ট তৈরি করুন
          </CardTitle>

          <CardDescription className="text-xs leading-relaxed text-muted-foreground">
            মেধাহাবে যোগ দিন এবং আজ থেকেই আপনার প্রস্তুতি শুরু করুন।
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-5 pb-5 sm:px-7 sm:pb-7">
          <RegisterForm redirect={redirectTo} />

          {/* Login */}

          <p className="text-center text-xs text-muted-foreground">
            ইতোমধ্যে অ্যাকাউন্ট আছে?

            <Link
              className="ml-1.5 font-medium text-primary transition-colors hover:underline"
              href={`/login${redirectQuery}`}
            >
              লগইন করুন
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
