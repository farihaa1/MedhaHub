"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

export function SubjectsCards() {
  const { data, isLoading, isError } = useGetSubjectsQuery()

  const subjects = data?.data ?? []

  return (
    <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Practice"
        title="বিষয় অনুযায়ী অনুশীলন করুন"
        description="আপনার পছন্দের বিষয় নির্বাচন করে সরাসরি MCQ অনুশীলন শুরু করুন।"
        href="/practice/subjects"
        linkText="সব বিষয় দেখুন"
      />

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-xl border bg-muted"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">
            বিষয়গুলো লোড করা সম্ভব হয়নি।
          </p>
        </div>
      )}

      {/* Subjects */}
      {!isLoading && !isError && subjects.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {subjects.map((subject) => (
            <Link
              key={subject._id}
              href={`/subject/${subject.slug}`}
              className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>

              <h3 className="font-semibold">{subject.title}</h3>

              <div className="mt-5 flex items-center text-sm font-medium text-primary">
                অনুশীলন করুন
                <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && subjects.length === 0 && (
        <div className="mt-8 rounded-xl border p-10 text-center">
          <BookOpen className="mx-auto size-8 text-muted-foreground" />

          <p className="mt-3 text-sm text-muted-foreground">
            এখনো কোনো বিষয় পাওয়া যায়নি।
          </p>
        </div>
      )}
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkText,
}: {
  eyebrow: string
  title: string
  description: string
  href: string
  linkText: string
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center text-sm font-medium text-primary hover:underline"
      >
        {linkText}

        <ArrowRight className="ml-1 size-4" />
      </Link>
    </div>
  )
}
