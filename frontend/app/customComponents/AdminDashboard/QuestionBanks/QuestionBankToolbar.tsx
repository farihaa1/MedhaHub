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
    <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Section */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
          
            placeholder="Search Question Bank..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category */}
        <Select
          value={category}
          onValueChange={(value) =>
            onCategoryChange(value as TQuestionBankCategory | "ALL")
          }
        >
          <SelectTrigger className="w-full sm:w-46">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="bcs">BCS</SelectItem>
            <SelectItem value="ntrca">NTRCA</SelectItem>
            <SelectItem value="psc-non-cadre">PSC Non Cadre</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="defence">Defence</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="admission">Admission</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>

        {/* Paper */}
        <Select
          value={paper}
          onValueChange={(value) =>
            onPaperChange(value as TQuestionBankPaper | "ALL")
          }
        >
          <SelectTrigger className="w-full sm:w-42.5">
            <SelectValue placeholder="Paper" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Papers</SelectItem>
            <SelectItem value="PRELIMINARY">Preliminary</SelectItem>
            <SelectItem value="WRITTEN">Written</SelectItem>
            <SelectItem value="VIVA">Viva</SelectItem>
            <SelectItem value="MODEL_TEST">Model Test</SelectItem>
            <SelectItem value="PRACTICE">Practice</SelectItem>
          </SelectContent>
        </Select>

        {/* Visibility */}
        <Select
          value={visibility}
          onValueChange={(value) =>
            onVisibilityChange(value as TQuestionBankVisibility | "ALL")
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-auto">
        <Button
          onClick={onCreate}
          className="w-full whitespace-nowrap lg:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Question Bank
        </Button>
      </div>
    </div>
  )
}
