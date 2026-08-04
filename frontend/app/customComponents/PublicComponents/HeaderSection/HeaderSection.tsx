import React from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Trophy,
} from "lucide-react"
import Link from 'next/link'

export function HeaderSection() {
  return (
    <div>
  
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--primary)_0,transparent_35%)] opacity-[0.08]" />

        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              BCS ও অন্যান্য চাকরি পরীক্ষার প্রস্তুতির জন্য
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              স্মার্টভাবে প্রস্তুতি নিন।
              <br />
              <span className="text-primary">সাফল্যের জন্য অনুশীলন করুন।</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              হাজার হাজার MCQ প্রশ্ন অনুশীলন করুন, বিষয় ও টপিক অনুযায়ী
              প্রস্তুতি নিন এবং মডেল পরীক্ষা দিয়ে নিজের প্রস্তুতি যাচাই করুন।
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/practice"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                অনুশীলন শুরু করুন
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/questions"
                className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
              >
                প্রশ্ন দেখুন
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <BookOpen className="size-4" />
                বিষয়ভিত্তিক প্রশ্ন
              </span>

              <span className="flex items-center gap-2">
                <ClipboardCheck className="size-4" />
                মডেল পরীক্ষা
              </span>

              <span className="flex items-center gap-2">
                <Trophy className="size-4" />
                নিজের অগ্রগতি দেখুন
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HeaderSection