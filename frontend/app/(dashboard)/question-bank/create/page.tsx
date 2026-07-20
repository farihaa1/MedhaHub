import QuestionBankForm from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankForm"

export default function CreateQuestionBankPage() {
  return (
    <div className="space-y-6 p-14">
      <div>
        <h1 className="text-3xl font-bold">Create Question Bank</h1>

        <p className="text-muted-foreground">
          Create a new question bank for exams or practice.
        </p>
      </div>

      <QuestionBankForm />
    </div>
  )
}
