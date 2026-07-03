import { Check, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayItemProps {
  day: string
  completed: boolean
  today?: boolean
  isLast: boolean
  nextCompleted?: boolean
}

export default function DayItem({
  day,
  completed,
  today,
  isLast,
  nextCompleted,
}: DayItemProps) {
  return (
    <div className="flex flex-1 flex-col items-center">
      {/* Circle + Line */}
      <div className="flex w-full items-center">
        {/* Circle */}
        <div
          className={cn(
            "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            today
              ? "border-orange-500 bg-orange-500 text-white shadow-lg"
              : completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-border bg-background"
          )}
        >
          {today ? (
            <Flame className="h-5 w-5" />
          ) : completed ? (
            <Check className="h-5 w-5" />
          ) : null}
        </div>

        {/* Connecting Line */}
        {!isLast && (
          <div
            className={cn(
              "h-0.75 flex-1 rounded-full",
              nextCompleted ? "bg-green-500" : "bg-muted"
            )}
          />
        )}
      </div>

      {/* Day */}
      <span className="mt-2 text-xs text-muted-foreground">{day}</span>
    </div>
  )
}
