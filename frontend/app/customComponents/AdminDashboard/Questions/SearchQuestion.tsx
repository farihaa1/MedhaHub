"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export default function SearchQuestion() {
  return (
    <div className="relative">
      <Search className="absolute top-3 left-3 size-4 text-muted-foreground" />

      <Input placeholder="Search questions..." className="pl-9" />
    </div>
  )
}
