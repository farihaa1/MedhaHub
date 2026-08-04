"use client"

import Link from "next/link"

import { getSubjectColorBySlug } from "@/app/data/colorPalete"
import { getSubjectProgress } from "@/app/data/userData"
import { ISubject } from "../../subjects.type"

interface Props {
  subject: ISubject
}

export default function SubjectCard({ subject }: Props) {
  const color = getSubjectColorBySlug(subject.slug)
  const progress = getSubjectProgress(subject.slug)

  return (
    <Link href={subject.url} className="block h-full">
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${color.border} ${color.bg}`}
      >
        {/* Title */}
        <h3 className="line-clamp-2 text-xs font-semibold text-white">
          {subject.title}
        </h3>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] text-gray-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-1.5 w-full rounded bg-white/10">
            <div
              className={`h-full rounded ${color.progress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4">
          <p className="text-[10px] text-gray-400">
            {subject.examsCount} Exams
          </p>
        </div>
      </div>
    </Link>
  )
}
