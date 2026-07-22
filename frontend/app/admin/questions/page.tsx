import QuestionStats from "@/app/customComponents/AdminDashboard/Questions/QuestionStats"
import QuestionToolbar from "@/app/customComponents/AdminDashboard/Questions/QuestionToolbar"
import QuestionFilters from "@/app/customComponents/AdminDashboard/Questions/QuestionFilters"
import PageHeader from "@/app/customComponents/AdminDashboard/AdminSubjects/PageHeader"
import QuestionTable from "@/app/customComponents/AdminDashboard/Questions/QuestionTable"

export default function AdminQuestionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Management"
        description="Create, organize, review, and manage all questions from one place."
      />

      <QuestionStats />

      <QuestionToolbar />

      <QuestionFilters />

      <QuestionTable />
    </div>
  )
}
