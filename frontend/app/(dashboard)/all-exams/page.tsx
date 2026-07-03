import AllExamsTable from "@/app/customComponents/AllExams/AllExamsTable"
import ExamHeader from "@/app/customComponents/AllExams/ExamHeader"
import FilterSection from "@/app/customComponents/AllExams/FilterSection"
import { mockExams } from "@/app/data/data"

export default function ExamsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
      <ExamHeader></ExamHeader>
      {/* Content View */}
      <main className="mx-auto w-full max-w-7xl space-y-6 p-6">
        {/* Breadcrumb Header */}
        <div>
          <h1 className="text-xl font-semibold text-white">সকল পরীক্ষা</h1>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <span>হোম</span>
            <span>&gt;</span>
            <span className="text-gray-400">সকল পরীক্ষা</span>
          </div>
        </div>

        {/* Configuration and Data components */}
        <FilterSection />
        <AllExamsTable exams={mockExams} />
      </main>
    </div>
  )
}
