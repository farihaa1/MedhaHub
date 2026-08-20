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
       
        <div className="relative lg:col-span-2">
          <Search className="absolute top-3.5 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="প্রশ্নব্যাংক খুঁজুন..."
            className="pl-10"
          />
        </div>

     
        <select
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          className="rounded-md border bg-background px-3"
        >
          <option value="">সকল প্রতিষ্ঠান</option>

          <option value="PSC">PSC</option>

          <option value="Bangladesh Bank">বাংলাদেশ ব্যাংক</option>

          <option value="NTRCA">NTRCA</option>

          <option value="DU">বিশ্ববিদ্যালয়</option>
        </select>

     
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="rounded-md border bg-background px-3"
        >
          <option value="">সকল বছর</option>

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

        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 rounded-md border bg-background px-3"
          >
            <option value="-createdAt">নতুন আগে</option>
            <option value="createdAt">পুরোনো আগে</option>
            <option value="title">নাম অনুযায়ী (ক-হ)</option>
            <option value="-title">নাম অনুযায়ী (হ-ক)</option>
            <option value="-year">সাম্প্রতিক বছর আগে</option>
          </select>

          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            title="ফিল্টার রিসেট করুন"
            aria-label="ফিল্টার রিসেট করুন"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
