
import DashboardHeader from "./DashboardHeader"
import StatsCards from "./StatsCards"
import QuickActions from "./QuickActions"
import LiveActivity from "./LiveActivity"
import PendingReviews from "./PendingReviews"
import RecentUsers from "./RecentUsers"
import DashboardAllPages from "./DashboardAllPages"

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <DashboardHeader />
      <DashboardAllPages></DashboardAllPages>

      {/* KPI Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      
      {/* Bottom Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <LiveActivity />
          <RecentUsers />
        </div>

        <div className="space-y-6">
          <PendingReviews />
        
        </div>
      </div>
    </div>
  )
}
