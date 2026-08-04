import { ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { leaderboard } from "./leaderboardData"
import LeaderboardItem from "./LeaderboardItem"

export default function Leaderboard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>লিডারবোর্ড</CardTitle>

          <p className="text-sm text-muted-foreground">আজকের র‍্যাঙ্ক</p>
        </div>

        <Button variant="ghost" size="sm">
          সব দেখুন
        </Button>
      </CardHeader>

      <CardContent className="space-y-2">
        {leaderboard.map((item) => (
          <LeaderboardItem key={item.id} {...item} />
        ))}

        <Button variant="outline" className="mt-4 w-full">
          সম্পূর্ণ লিডারবোর্ড দেখুন
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
