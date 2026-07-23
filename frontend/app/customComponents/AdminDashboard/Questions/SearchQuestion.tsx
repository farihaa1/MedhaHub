"use client"

import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchQuestionProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchQuestion({
  value,
  onChange,
  placeholder = "Search by question, subject, chapter or topic...",
}: SearchQuestionProps) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-12 pl-10"
      />

      {value && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
