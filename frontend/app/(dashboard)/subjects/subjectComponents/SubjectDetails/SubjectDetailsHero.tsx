"use client"

import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileQuestion,
  Trophy,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface SubjectDetailsHeroProps {
  title: string
  description: string
  totalQuestions: number
  totalChapters: number
  completedQuestions: number
  totalTopics: number
  estimatedHours: number
}

export default function SubjectDetailsHero({
  title,
  description,
  totalQuestions,
  totalChapters,
  completedQuestions,
  totalTopics,
  estimatedHours,
}: SubjectDetailsHeroProps) {
  const progress =
    totalQuestions > 0
      ? Math.min(100, Math.round((completedQuestions / totalQuestions) * 100))
      : 0

  const remainingQuestions = Math.max(0, totalQuestions - completedQuestions)

  return (
    <section className="relative overflow-hidden rounded-2xl p-5 sm:p-6">
      
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* =====================================================
            LEFT
        ===================================================== */}

        <div>
          {/* Label */}
          <span className="inline-flex rounded-md border bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            বিষয় প্রস্তুতি
          </span>

          {/* Title */}
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCard
              icon={<BookOpen className="h-4 w-4" />}
              title="অধ্যায়"
              value={totalChapters}
            />

            <StatCard
              icon={<FileQuestion className="h-4 w-4" />}
              title="প্রশ্ন"
              value={totalQuestions.toLocaleString()}
            />

            <StatCard
              icon={<Clock3 className="h-4 w-4" />}
              title="সময়"
              value={`${estimatedHours} ঘন্টা`}
            />

            <StatCard
              icon={<Trophy className="h-4 w-4" />}
              title="টপিক"
              value={totalTopics}
            />
          </div>

          {/* Action */}
          <Button size="sm" className="mt-5 h-9 text-xs">
            প্রস্তুতি শুরু করুন
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* =====================================================
            RIGHT — PROGRESS
        ===================================================== */}

        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                মোট অগ্রগতি
              </p>

              <p className="mt-1 text-3xl font-bold text-foreground">
                {progress}%
              </p>
            </div>

            {/* Progress circle */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary/20">
              <span className="text-xs font-semibold text-foreground">
                {progress}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={progress} className="mt-4 h-1.5" />

          {/* Completed */}
          <div className="mt-4 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">সম্পন্ন</span>

            <span className="font-medium text-foreground">
              {completedQuestions.toLocaleString()}
            </span>
          </div>

          {/* Remaining */}
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">বাকি</span>

            <span className="font-medium text-foreground">
              {remainingQuestions.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-3 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground">{title}</p>

          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
