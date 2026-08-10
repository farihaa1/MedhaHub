import HeroSection from "@/app/customComponents/Dashboard/customBlocks/HeroSection/HeroSection"
import StatsGrid from "@/app/customComponents/Dashboard/customBlocks/Stats/StatsGrid"
import QuickAccessGrid from "@/app/customComponents/Dashboard/customBlocks/QuickAccessCard/QuickAccessGrid"
import TodaysPlan from "@/app/customComponents/Dashboard/customBlocks/TodaysPlan/TodaysPlan"
import SubjectProgress from "@/app/customComponents/Dashboard/customBlocks/SubjectProgress/SubjectProgress"
import Leaderboard from "@/app/customComponents/Dashboard/customBlocks/Leaderboard/Leaderboard"
import StudyStreak from "@/app/customComponents/Dashboard/customBlocks/StudyStreak/StudyStreak"
import MotivationCard from "@/app/customComponents/Dashboard/customBlocks/Motivation/MotivationCard"

export default function Dashboard() {
  return (
    <main className="container mx-auto px-4 py-6 md:px-8">
      <HeroSection />
      <StatsGrid />

      <QuickAccessGrid />

      <TodaysPlan />

      <SubjectProgress />

      <div className="space-y-6">
        <Leaderboard />

        <StudyStreak />

        <MotivationCard />
      </div>
    </main>
  )
}
