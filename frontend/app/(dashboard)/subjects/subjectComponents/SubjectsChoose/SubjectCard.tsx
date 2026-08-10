"use client"

import Link from "next/link"

import { ISubject } from "../../subjects.type"

interface Props {
  subject: ISubject
}

export default function SubjectCard({ subject }: Props) {
  const progress = 0

  return (
    <Link href={`/subjects/${subject.slug}`} className="block">
      <div className="group relative flex min-h-32 flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
        {/* Subject title */}

        <h2 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {subject.title}
        </h2>

        {/* Progress */}

        <div className="mt-auto pt-5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">অগ্রগতি</span>

            <span className="text-[10px] font-medium text-muted-foreground">
              {progress}%
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Exam count */}

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            {subject.examsCount}টি পরীক্ষা
          </p>

          <span className="text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            দেখুন →
          </span>
        </div>
      </div>
    </Link>
  )
}
