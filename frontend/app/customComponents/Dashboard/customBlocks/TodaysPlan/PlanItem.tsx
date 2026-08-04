"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { Plan } from "./types"

interface Props extends Plan {
  onToggle: () => void
}

export default function PlanItem({
  title,
  completed,
  total,
  progress,
  done,
  onToggle,
}: Props) {
  return (
    <div className="space-y-2 rounded-lg border p-3 transition hover:bg-accent/40">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={done}
          onCheckedChange={onToggle}
          className="mt-1 rounded-full"
        />

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3
                className={cn(
                  "font-medium",
                  done && "text-muted-foreground line-through"
                )}
              >
                {title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {completed}/{total} প্রশ্ন সম্পন্ন
              </p>
            </div>

            <span
              className={cn(
                "font-semibold",
                progress === 100 ? "text-green-500" : "text-muted-foreground"
              )}
            >
              {progress}%
            </span>
          </div>

          <Progress value={progress} className="mt-2 h-1.5" />
        </div>
      </div>
    </div>
  )
}
