
import AllExamsTable from "@/app/customComponents/Dashboard/AllExams/AllExamsTable"
import ExamHeader from "@/app/customComponents/Dashboard/AllExams/ExamHeader"
import FilterSection from "@/app/customComponents/Dashboard/AllExams/FilterSection"

export default function ExamsPage() {
  return (
    <div className="w-full">
      {/* Content View */}
      <main className="space-y-6 p-6">
        {/* Breadcrumb Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            সকল পরীক্ষা
          </h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>হোম</span>
            <span>&gt;</span>
            <span>সকল পরীক্ষা</span>
          </div>
        </div>

        {/* Exam Header */}
        <ExamHeader />

        {/* Filters */}
        <FilterSection />

        {/* 
          No mock data is used here.
          The AllExamsTable currently receives an empty list
          until a real "get all exams" API is connected.
        */}
        <AllExamsTable exams={[]} />
      </main>
    </div>
  )
}