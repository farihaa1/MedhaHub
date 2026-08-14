import {
  BookOpen,
  Building2,
  Calendar,
  FileText,
  GraduationCap,
} from "lucide-react"

import { Card } from "@/components/ui/card"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

interface Props {
  bank: IQuestionBank
  totalQuestions: number
}

export default function QuestionBankInfo({ bank, totalQuestions }: Props) {
  return (
    <Card className="px-6 py-6 sm:px-8 lg:px-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {bank.title}
        </h1>

        {bank.description && (
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            {bank.description}
          </p>
        )}
      </div>

      {/* Info */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <InfoCard
          icon={<Building2 className="h-4 w-4" />}
          title="প্রতিষ্ঠান"
          value={bank.organization}
        />

        <InfoCard
          icon={<Calendar className="h-4 w-4" />}
          title="বছর"
          value={bank.year}
        />

        <InfoCard
          icon={<GraduationCap className="h-4 w-4" />}
          title="ক্যাটাগরি"
          value={bank.category}
        />

        <InfoCard
          icon={<FileText className="h-4 w-4" />}
          title="পেপার"
          value={bank.paper}
        />

        <InfoCard
          icon={<BookOpen className="h-4 w-4" />}
          title="মোট প্রশ্ন"
          value={totalQuestions}
        />
      </div>
    </Card>
  )
}

interface InfoCardProps {
  title: string
  value: string | number | null | undefined
  icon: React.ReactNode
}

function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-sm">{title}</span>
      </div>

      <p className="font-medium">{value ?? "—"}</p>
    </div>
  )
}
