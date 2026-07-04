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
import { color } from "@/app/type"
import { getTheme } from "@/app/data/colorPalete"

interface SubjectDetailsHeroProps {
  title: string
  description: string
  totalQuestions: number
  totalChapters: number
  completedQuestions: number
  totalTopics: number
  estimatedHours: number
  color: color
}

export default function SubjectDetailsHero({
  title,
  description,
  totalQuestions,
  totalChapters,
  completedQuestions,
  totalTopics,
  estimatedHours,
  color,
}: SubjectDetailsHeroProps) {
  const theme = getTheme(color.name)

  const progress = Math.round((completedQuestions / totalQuestions) * 100)
  return (
    <section className="relative overflow-hidden rounded-3xl p-8">
      {/* Background Glow */}

      <div
        className={`absolute -top-24 -right-32 h-80 w-80 rounded-full blur-[120px] ${theme.bg}`}
      />

      <div
        className={`absolute -bottom-20 left-20 h-64 w-64 rounded-full blur-[120px] ${theme.bg}`}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_330px]">
        {/* LEFT */}

        <div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${theme.border} ${theme.bg} ${theme.text}`}
          >
            MedhaHub Subject
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            {description}
          </p>

          {/* Stats */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<BookOpen size={20} />}
              title="Chapters"
              value={totalChapters}
              color={color}
            />

            <StatCard
              icon={<FileQuestion size={20} />}
              title="Questions"
              value={totalQuestions.toLocaleString()}
              color={color}
            />

            <StatCard
              icon={<Clock3 size={20} />}
              title="Study Time"
              value={`${estimatedHours} hrs`}
              color={color}
            />

            <StatCard
              icon={<Trophy size={20} />}
              title="Topics"
              value={totalTopics}
              color={color}
            />
          </div>

          <Button size="lg" className={`mt-8 ${theme.button}`}>
            Continue Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* RIGHT */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur">
          <p className="text-sm font-medium text-zinc-400">Overall Progress</p>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <h2 className="text-5xl font-bold text-white">{progress}%</h2>

              <p className="mt-2 text-sm text-zinc-500">
                {completedQuestions.toLocaleString()} /
                {totalQuestions.toLocaleString()} Questions
              </p>
            </div>

            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full border-8 ${theme.ring}`}
            >
              <span className={`text-xl font-bold ${theme.text}`}>
                {progress}%
              </span>
            </div>
          </div>

          <Progress value={progress} className="mt-6 h-3 bg-zinc-800" />

          <div className="mt-8 space-y-3">
            <ProgressItem label="Completed" value={completedQuestions} />

            <ProgressItem
              label="Remaining"
              value={totalQuestions - completedQuestions}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: color
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const theme = getTheme(color.name)

  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition ${theme.hover} hover:bg-zinc-900`}
    >
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${theme.bg} ${theme.icon}`}
      >
        {icon}
      </div>

      <p className="text-sm text-zinc-400">{title}</p>

      <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
    </div>
  )
}

interface ProgressItemProps {
  label: string
  value: number
}

function ProgressItem({ label, value }: ProgressItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
      <span className="text-sm text-zinc-400">{label}</span>

      <span className="font-semibold text-white">{value.toLocaleString()}</span>
    </div>
  )
}
