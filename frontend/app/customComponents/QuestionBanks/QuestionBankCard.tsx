import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { IQuestionBank } from "@/app/redux/types/questionBank.types"

interface Props {
  bank: IQuestionBank
}

export default function QuestionBankCard({ bank }: Props) {
  return (
    <Link
      href={`/question-banks/${bank.category}/${bank.slug}`}
      className="group flex items-center justify-between rounded-xl border bg-card p-5 transition-all hover:border-gray-400 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold transition-colors group-hover:text-primary">
          {bank.title}
        </h2>

        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {bank.year}
        </span>
      </div>

      <div className="flex items-center gap-1 text-sm font-medium text-primary">
        প্রশ্ন দেখুন
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
