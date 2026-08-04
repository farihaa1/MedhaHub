import {
  Award,
  Target,
  BookOpen,
  Trophy,
} from "lucide-react"
import { StatCard } from "./StatsCard"



export default function StatsGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="XP Points"
        value="৪,৮২০"
        subtitle="+১২০ আজ"
        icon={Award}
        iconBg="bg-green-500/10"
        iconColor="text-green-500"
      />

      <StatCard
        title="Accuracy"
        value="৭১%"
        subtitle="-৩% এই সপ্তাহে"
        icon={Target}
        iconBg="bg-red-500/10"
        iconColor="text-red-500"
      />

      <StatCard
        title="Questions Done"
        value="২,১৪০"
        subtitle="১২,০০০+ এর মধ্যে"
        icon={BookOpen}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />

      <StatCard
        title="Rank"
        value="#৩৪২"
        subtitle="Top 5% • BCS"
        icon={Trophy}
        iconBg="bg-purple-500/10"
        iconColor="text-purple-500"
      />
    </section>
  )
}