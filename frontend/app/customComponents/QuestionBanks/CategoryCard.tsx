"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { QuestionBankCategory } from "@/lib/questionBankCategories"
import CategoryBadge from "./CategoryBadge"

interface Props {
  category: QuestionBankCategory
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/question-banks/${category.slug}`}
      className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{category.title}</h3>

        <CategoryBadge count={category.questionCount} />
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {category.description}
      </p>

      <div className="mt-6 flex items-center gap-2 font-medium text-primary">
        প্রশ্ন দেখুন
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
