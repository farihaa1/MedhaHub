import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { subjectProgress } from "./progressData"
import SubjectProgressItem from "./SubjectProgressItem"

export default function SubjectProgress() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>

          <div>
            <CardTitle>বিষয়ভিত্তিক অগ্রগতি</CardTitle>

            <CardDescription>
              প্রতিটি বিষয়ে আপনার বর্তমান প্রস্তুতির অবস্থা
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {subjectProgress.map((item) => (
          <SubjectProgressItem key={item.id} {...item} />
        ))}
      </CardContent>
    </Card>
  )
}
