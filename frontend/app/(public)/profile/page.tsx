"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  Lock,
  Pencil,
  BookOpen,
  Trophy,
  Target,
  Clock3,
  CheckCircle2,
  LogOut,
  Camera,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useMeQuery } from "@/app/redux/api/authApi"

export default function ProfilePage() {
  const { data, isLoading, isError } = useMeQuery()

  const [editing, setEditing] = useState(false)

  if (isLoading) {
    return <ProfileLoading />
  }

  if (isError || !data?.data) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-background px-4 py-8">
        <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
          <Card className="w-full rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <User className="h-8 w-8 text-destructive" />
              </div>

              <h1 className="text-2xl font-bold">প্রোফাইল লোড করা যায়নি</h1>

              <p className="mt-2 text-muted-foreground">
                আপনার তথ্য দেখাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
              </p>

              <Button
                className="mt-6 rounded-xl"
                onClick={() => window.location.reload()}
              >
                আবার চেষ্টা করুন
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const user = data.data

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div>
          <h1 className="text-3xl font-bold tracking-tight">আমার প্রোফাইল</h1>

          <p className="mt-1 text-muted-foreground">
            আপনার ব্যক্তিগত তথ্য ও শেখার অগ্রগতি দেখুন
          </p>
        </div>

        {/* =====================================================
            PROFILE HERO
        ====================================================== */}

        <Card className="overflow-hidden rounded-3xl border shadow-sm">
          {/* Cover */}

          <div className="h-32 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40 sm:h-40" />

          <CardContent className="relative px-5 pb-6 sm:px-8">
            {/* Avatar */}

            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <div className="group relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-primary text-4xl font-bold text-primary-foreground shadow-lg sm:h-32 sm:w-32">
                    {getInitials(user.name || "ম")}
                  </div>

                  <button
                    type="button"
                    className="absolute right-1 bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-background shadow-md transition hover:bg-muted"
                    title="ছবি পরিবর্তন করুন"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="pb-1">
                  <h2 className="text-2xl font-bold">
                    {user.name || "মেধাহাব ব্যবহারকারী"}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email || "ইমেইল দেওয়া হয়নি"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setEditing(!editing)}
              >
                <Pencil className="mr-2 h-4 w-4" />

                {editing ? "সম্পাদনা বন্ধ করুন" : "প্রোফাইল সম্পাদনা"}
              </Button>
            </div>

            {/* Verification */}

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                অ্যাকাউন্ট সক্রিয়
              </div>

              {user.email && (
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  ইমেইল যাচাইকৃত
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* =====================================================
            PROFILE CONTENT
        ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* =================================================
              PERSONAL INFORMATION
          ================================================== */}

          <Card className="rounded-3xl lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>ব্যক্তিগত তথ্য</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  আপনার অ্যাকাউন্টের তথ্য
                </p>
              </div>

              <User className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                <ProfileInfo
                  icon={<User />}
                  label="নাম"
                  value={user.name || "তথ্য নেই"}
                />

                <ProfileInfo
                  icon={<Mail />}
                  label="ইমেইল"
                  value={user.email || "তথ্য নেই"}
                />
{/* 
                <ProfileInfo
                  icon={<Phone />}
                  label="ফোন নম্বর"
                  value={user.phone || user.phoneNumber || "তথ্য নেই"}
                /> */}

                <ProfileInfo
                  icon={<CalendarDays />}
                  label="যোগদানের তারিখ"
                  value={formatDate(user.createdAt)}
                />
              </div>

              {editing && (
                <div className="mt-6 border-t pt-6">
                  <p className="mb-4 text-sm font-medium">প্রোফাইল সম্পাদনা</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        নাম
                      </label>

                      <input
                        defaultValue={user.name || ""}
                        className="w-full rounded-xl border bg-background px-4 py-3 transition outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        ফোন নম্বর
                      </label>

                      {/* <input
                        defaultValue={user?.phone || user.phoneNumber || ""}
                        className="w-full rounded-xl border bg-background px-4 py-3 transition outline-none focus:border-primary"
                      /> */}
                    </div>
                  </div>

                  <Button className="mt-5 rounded-xl">
                    পরিবর্তন সংরক্ষণ করুন
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* =================================================
              ACCOUNT SECURITY
          ================================================== */}

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>অ্যাকাউন্ট নিরাপত্তা</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="font-medium">পাসওয়ার্ড পরিবর্তন</p>

                  <p className="text-xs text-muted-foreground">
                    আপনার পাসওয়ার্ড আপডেট করুন
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="font-medium">নিরাপত্তা</p>

                  <p className="text-xs text-muted-foreground">
                    অ্যাকাউন্ট নিরাপত্তা দেখুন
                  </p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* =====================================================
            LEARNING STATISTICS
        ====================================================== */}

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">আমার পড়াশোনার অগ্রগতি</h2>

            <p className="text-sm text-muted-foreground">
              মেধাহাবে আপনার শেখার পরিসংখ্যান
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<BookOpen />}
              title="পরীক্ষা দিয়েছেন"
              value="০"
              description="মোট পরীক্ষা"
            />

            <StatCard
              icon={<Trophy />}
              title="সেরা স্কোর"
              value="০%"
              description="সর্বোচ্চ ফলাফল"
            />

            <StatCard
              icon={<Target />}
              title="সঠিক উত্তর"
              value="০"
              description="মোট সঠিক উত্তর"
            />

            <StatCard
              icon={<Clock3 />}
              title="পড়াশোনার সময়"
              value="০ ঘন্টা"
              description="মোট সময়"
            />
          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>দ্রুত কাজ</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction
                icon={<BookOpen />}
                title="বিষয়সমূহ"
                href="/subjects"
              />

              <QuickAction icon={<Target />} title="অনুশীলন" href="/practice" />

              <QuickAction
                icon={<Trophy />}
                title="প্রশ্নব্যাংক"
                href="/question-banks"
              />

              <QuickAction icon={<LogOut />} title="লগআউট" href="/logout" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

/* ============================================================
   PROFILE INFO
============================================================ */

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 truncate font-medium">{value}</p>
      </div>
    </div>
  )
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}) {
  return (
    <Card className="rounded-2xl transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
          </div>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">{title}</p>

        <p className="mt-1 text-2xl font-bold">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode
  title: string
  href: string
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-2xl border p-4 transition hover:border-primary hover:bg-primary/5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>

      <span className="font-medium">{title}</span>
    </a>
  )
}

/* ============================================================
   LOADING
============================================================ */

function ProfileLoading() {
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-80 animate-pulse rounded bg-muted" />
        </div>

        <div className="overflow-hidden rounded-3xl border bg-card">
          <div className="h-40 animate-pulse bg-muted" />

          <div className="p-8">
            <div className="-mt-20">
              <div className="h-32 w-32 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="h-7 w-52 animate-pulse rounded bg-muted" />
              <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-3xl bg-muted lg:col-span-2" />

          <div className="h-80 animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>
    </main>
  )
}

/* ============================================================
   HELPERS
============================================================ */

function getInitials(name: string) {
  const words = name.trim().split(/\s+/)

  if (words.length === 1) {
    return words[0]?.charAt(0)?.toUpperCase() || "ম"
  }

  return (
    (words[0]?.charAt(0) || "") + (words[1]?.charAt(0) || "")
  ).toUpperCase()
}

function formatDate(date?: string) {
  if (!date) return "তথ্য নেই"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "তথ্য নেই"
  }

  return parsedDate.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
