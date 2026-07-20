import SubjectTable from "@/app/customComponents/AdminDashboard/AdminSubjects/SubjectTable";

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Subjects"
        description="Manage all subjects"
        action={<CreateSubjectDialog />}
      /> */}

      <SubjectTable />
    </div>
  )
}
