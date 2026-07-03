import { BookOpen } from "lucide-react"

import { Progress } from "@/components/ui/progress"

import { ProgressColor, progressColors } from "./progressColors"

interface SubjectProgressItemProps {
  subject: string
  completed: number
  total: number
  progress: number
  color: ProgressColor
}

export default function SubjectProgressItem({
  subject,
  completed,
  total,
  progress,
  color,
}: SubjectProgressItemProps) {
  return (
    <div className="space-y-3 rounded-xl border p-3 transition-all hover:border-primary/30 hover:bg-accent/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h4 className="font-semibold text-xs">{subject}</h4>

            <p className="text-[10px] text-muted-foreground">
              {completed}/{total} প্রশ্ন
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold">{progress}%</span>
      </div>

      <Progress value={progress} className={`h-1 ${progressColors[color]}`} />
    </div>
  )
}
