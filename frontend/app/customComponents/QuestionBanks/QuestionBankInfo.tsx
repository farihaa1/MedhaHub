import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

interface Props {
  bank: IQuestionBank
  totalQuestions: number
}

export default function QuestionBankInfo({ bank, totalQuestions }: Props) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{bank.year}</Badge>

            <Badge variant="secondary">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              {bank.status}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{bank.title}</h1>

          {bank.description && (
            <p className="max-w-3xl text-muted-foreground">
              {bank.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <InfoCard
          icon={<Building2 className="h-4 w-4" />}
          title="Organization"
          value={bank.organization}
        />

        <InfoCard
          icon={<Calendar className="h-4 w-4" />}
          title="Year"
          value={bank.year}
        />

        <InfoCard
          icon={<GraduationCap className="h-4 w-4" />}
          title="Category"
          value={bank.category}
        />

        <InfoCard
          icon={<FileText className="h-4 w-4" />}
          title="Paper"
          value={bank.paper}
        />

        <InfoCard
          icon={<BookOpen className="h-4 w-4" />}
          title="Questions"
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

      <p className="font-medium">{value || "-"}</p>
    </div>
  )
}
