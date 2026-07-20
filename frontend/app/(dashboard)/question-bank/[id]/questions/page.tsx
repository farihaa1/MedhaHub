import AddQuestionDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/AddQuestionDialog"
import QuestionBankItemTable from "@/app/customComponents/AdminDashboard/QuestionBanks/items/QuestionBankItemTable"


type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function QuestionBankQuestionsPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6 p-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Bank Questions</h1>

          <p className="text-muted-foreground">
            Manage all questions inside this question bank.
          </p>
        </div>

        <AddQuestionDialog questionBankId={id} />
      </div>

      <QuestionBankItemTable questionBankId={id} />
    </div>
  )
}
