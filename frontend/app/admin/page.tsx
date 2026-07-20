import AdminDashboardCard from "../customComponents/AdminDashboard/AdminDashboardCard/AdminDashboardCard"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground py-4">Welcome back, Administrator.</p>

      <div>
        <AdminDashboardCard></AdminDashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Recent Question Submissions
          </h2>

          <p className="text-muted-foreground">No submissions found.</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Users</h2>

          <p className="text-muted-foreground">No users found.</p>
        </div>
      </div>
    </div>
  )
}
