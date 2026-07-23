"use client"

import Link from "next/link"
import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  breadcrumbs?: ReactNode
}

export default function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        {breadcrumbs ?? (
          <nav className="text-sm text-muted-foreground">
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </nav>
        )}

        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>

          {description && (
            <p className="mt-1 text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex shrink-0 mt-3 lg:mt-0 items-center gap-2 text-xs">{action}</div>
      )}
    </div>
  )
}
