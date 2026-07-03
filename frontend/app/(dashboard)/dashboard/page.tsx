import { Card } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import ProductInsightsCard from "@/app/customComponents/Dashboard/blocks/widget-product-insights"
import SalesMetricsCard from "@/app/customComponents/Dashboard/blocks/chart-sales-metrics"
import StatisticsCard from "@/app/customComponents/Dashboard/blocks/statistics-card"
import TotalEarningCard from "@/app/customComponents/Dashboard/blocks/widget-total-earning"
import TransactionDatatable from "@/app/customComponents/Dashboard/blocks/datatable-transaction"
import FacebookIcon from "@/public/svg/facebook-icon"
import InstagramIcon from "@/public/svg/instagram-icon"
import LinkedinIcon from "@/public/svg/linkedin"
import TwitterIcon from "@/public/svg/twitter-icon"
import {
  earningData,
  StatisticsCardData,
  transactionData,
} from "@/app/data/data"
import DashboardSidebar from "@/app/customComponents/Dashboard/customBlocks/Navbar/DashboardSidebar"
import Header from "@/app/customComponents/Dashboard/customBlocks/Header/Header"
import HeroSection from "@/app/customComponents/Dashboard/customBlocks/HeroSection/HeroSection"
import StatsGrid from "@/app/customComponents/Dashboard/customBlocks/Stats/StatsGrid"
import QuickAccessGrid from "@/app/customComponents/Dashboard/customBlocks/QuickAccessCard/QuickAccessGrid"
import TodaysPlan from "@/app/customComponents/Dashboard/customBlocks/TodaysPlan/TodaysPlan"
import SubjectProgress from "@/app/customComponents/Dashboard/customBlocks/SubjectProgress/SubjectProgress"
import Leaderboard from "@/app/customComponents/Dashboard/customBlocks/Leaderboard/Leaderboard"
import StudyStreak from "@/app/customComponents/Dashboard/customBlocks/StudyStreak/StudyStreak"
import MotivationCard from "@/app/customComponents/Dashboard/customBlocks/Motivation/MotivationCard"

const DashboardShell = () => {
  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col">
      <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <HeroSection />
            <StatsGrid />
            <QuickAccessGrid></QuickAccessGrid>
            <div className="flex gap-5">
              <TodaysPlan />
              <SubjectProgress />
            </div>
          </div>

          <div className="space-y-6">
            <Leaderboard />
            <StudyStreak></StudyStreak>
            <MotivationCard></MotivationCard>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardShell
