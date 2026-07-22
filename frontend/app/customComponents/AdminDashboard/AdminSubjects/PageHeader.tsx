"use client"

import Link from "next/link"
import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <div>
          <Link
            className="text-sm text-muted-foreground lowercase"
            href="/admin"
          >
            Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight pt-5">{title}</h1>

        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>

      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </div>
  )
}
