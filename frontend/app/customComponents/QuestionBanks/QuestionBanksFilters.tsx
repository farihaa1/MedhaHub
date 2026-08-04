"use client"

import { Search, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  search: string
  organization: string
  year: string
  sort: string

  onSearchChange: (value: string) => void
  onOrganizationChange: (value: string) => void
  onYearChange: (value: string) => void
  onSortChange: (value: string) => void
  onReset: () => void
}

export default function QuestionBanksFilters({
  search,
  organization,
  year,
  sort,
  onSearchChange,
  onOrganizationChange,
  onYearChange,
  onSortChange,
  onReset,
}: Props) {
  return (
    <section className="mb-10 rounded-xl border bg-card p-5">
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Search */}

        <div className="relative lg:col-span-2">
          <Search className="absolute top-3.5 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search question banks..."
            className="pl-10"
          />
        </div>

        {/* Organization */}

        <select
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          className="rounded-md border bg-background px-3"
        >
          <option value="">All Organizations</option>

          <option value="PSC">PSC</option>

          <option value="Bangladesh Bank">Bangladesh Bank</option>

          <option value="NTRCA">NTRCA</option>

          <option value="DU">University</option>
        </select>

        {/* Year */}

        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="rounded-md border bg-background px-3"
        >
          <option value="">All Years</option>

          {Array.from({ length: 15 }).map((_, index) => {
            const currentYear = new Date().getFullYear()

            const value = String(currentYear - index)

            return (
              <option key={value} value={value}>
                {value}
              </option>
            )
          })}
        </select>

        {/* Sort */}

        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 rounded-md border bg-background px-3"
          >
            <option value="-createdAt">Newest</option>

            <option value="createdAt">Oldest</option>

            <option value="title">Title (A-Z)</option>

            <option value="-title">Title (Z-A)</option>

            <option value="-year">Latest Year</option>
          </select>

          <Button variant="outline" size="icon" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
