import { Flame, Trophy } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import DayItem from "./DayItem"
import { streakData } from "./streakData"

export default function StudyStreak() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          আপনার স্ট্রিক
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Stats */}
        <div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{streakData.current}</span>

            <span className="pb-1 text-sm text-muted-foreground">দিন</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4 text-yellow-500" />
            সেরা স্ট্রিক {streakData.best} দিন
          </div>
        </div>

        {/* Timeline */}
        <div className="flex">
          {streakData.days.map((day, index) => (
            <DayItem
              key={day.day}
              {...day}
              isLast={index === streakData.days.length - 1}
              nextCompleted={streakData.days[index + 1]?.completed}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
