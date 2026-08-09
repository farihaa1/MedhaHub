
"use client"

import { useRouter } from "next/navigation"

import QuestionBankForm, {
  QuestionBankFormValues,
} from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankForm"

import { useCreateQuestionBankMutation } from "@/app/redux/api/questionBanksApi"

export default function CreateQuestionBankPage() {
  const router = useRouter()

  const [createQuestionBank, { isLoading }] =
    useCreateQuestionBankMutation()

  const handleSubmit = async (values: QuestionBankFormValues) => {
    try {
      await createQuestionBank(values).unwrap()

      // After successful creation
      router.push("/question-bank")
    } catch (error) {
      console.error("Failed to create question bank:", error)
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Question Bank
          </h1>

          <p className="mt-2 text-muted-foreground">
            Create a new question bank for exams or practice.
          </p>
        </div>

        {/* Form */}
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <QuestionBankForm
            onSubmit={handleSubmit}
            loading={isLoading}
          />
        </section>
      </div>
    </main>
  )
}
