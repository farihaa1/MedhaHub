"use client"

import { ReactNode } from "react"

interface Props {
  title: string
  value: number
  icon: ReactNode
}

export default function QuestionStatCard({ title, value, icon }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value.toLocaleString()}</h2>
        </div>

        {icon}
      </div>
    </div>
  )
}
