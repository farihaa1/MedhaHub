import QuestionBankTable from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function QuestionBanksPage() {
  return (
    <div className="space-y-6 p-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Banks</h1>
          <p className="text-muted-foreground">Manage all question banks.</p>
        </div>

        <Button asChild>
          <Link href="/question-bank/create">
            Create Question Bank
          </Link>
        </Button>
      </div>

      <QuestionBankTable />
    </div>
  )
}
