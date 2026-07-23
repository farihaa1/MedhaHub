"use client"

import { Search, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  TQuestionBankCategory,
  TQuestionBankPaper,
  TQuestionBankVisibility,
} from "@/app/redux/types/questionBank.types"

interface Props {
  search: string
  onSearchChange: (value: string) => void

  category: TQuestionBankCategory | "ALL"
  onCategoryChange: (value: TQuestionBankCategory | "ALL") => void

  paper: TQuestionBankPaper | "ALL"
  onPaperChange: (value: TQuestionBankPaper | "ALL") => void

  visibility: TQuestionBankVisibility | "ALL"
  onVisibilityChange: (value: TQuestionBankVisibility | "ALL") => void

  onCreate: () => void
}

export default function QuestionBankToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  paper,
  onPaperChange,
  visibility,
  onVisibilityChange,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-4">
      <div className="relative min-w-65 flex-1">
        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

        <Input
          className="pl-9"
          placeholder="Search Question Bank..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={category ?? "ALL"} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-42.5">
          <SelectValue placeholder="Category" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          <SelectItem value="BCS">BCS</SelectItem>
          <SelectItem value="PRIMARY">PRIMARY</SelectItem>
          <SelectItem value="NTRCA">NTRCA</SelectItem>
          <SelectItem value="BANK">BANK</SelectItem>
          <SelectItem value="UNIVERSITY">UNIVERSITY</SelectItem>
          <SelectItem value="CUSTOM">CUSTOM</SelectItem>
        </SelectContent>
      </Select>

      <Select value={paper ?? "ALL"} onValueChange={onPaperChange}>
        <SelectTrigger className="w-42.5">
          <SelectValue placeholder="Paper" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Papers</SelectItem>
          <SelectItem value="PRELIMINARY">PRELIMINARY</SelectItem>
          <SelectItem value="WRITTEN">WRITTEN</SelectItem>
          <SelectItem value="VIVA">VIVA</SelectItem>
        </SelectContent>
      </Select>

      <Select value={visibility ?? "ALL"} onValueChange={onVisibilityChange}>
        <SelectTrigger className="w-42.5">
          <SelectValue placeholder="Visibility" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="PUBLIC">PUBLIC</SelectItem>
          <SelectItem value="PRIVATE">PRIVATE</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create Question Bank
      </Button>
    </div>
  )
}
