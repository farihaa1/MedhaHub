import CreateSubjectDialog from "@/app/customComponents/AdminDashboard/AdminSubjects/CreateSubjectDialog"
import PageHeader from "@/app/customComponents/shared/PageHeader"

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        description="Manage all subjects"
        action={<CreateSubjectDialog />}
      />
    </div>
  )
}
