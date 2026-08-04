import QuestionBankEditForm from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankEditForm"

export default async function EditQuestionBankPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="space-y-6 p-16">
      <div>
        <h1 className="text-3xl font-bold">Edit Question Bank</h1>

        <p className="text-muted-foreground">
          Update question bank information.
        </p>
      </div>

      <QuestionBankEditForm id={id} />
    </div>
  )
}
