"use client"

import { useEffect, useMemo, useState } from "react"

import { Clock } from "lucide-react"

interface ExamTimerProps {
  startTime: string
  duration: number
  onExpire: () => void
}

export default function ExamTimer({
  startTime,
  duration,
  onExpire,
}: ExamTimerProps) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const calculateRemaining = () => {
      const start = new Date(startTime).getTime()

      // duration is in minutes
      const end = start + duration * 60 * 1000

      const now = Date.now()

      return Math.max(0, Math.floor((end - now) / 1000))
    }

    const interval = window.setInterval(() => {
      const next = calculateRemaining()

      setRemaining(next)

      if (next <= 0) {
        window.clearInterval(interval)
        onExpire()
      }
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [startTime, duration, onExpire])

  const formattedTime = useMemo(() => {
    if (remaining === null) {
      return "--:--"
    }

    const hours = Math.floor(remaining / 3600)

    const minutes = Math.floor((remaining % 3600) / 60)

    const seconds = remaining % 60

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`
  }, [remaining])

  const isAlmostFinished =
    remaining !== null && remaining > 0 && remaining <= 60

  return (
    <div
      className={[
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",

        isAlmostFinished
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-foreground",
      ].join(" ")}
    >
      <Clock className="h-4 w-4 shrink-0" />

      <span>{formattedTime}</span>
    </div>
  )
}
