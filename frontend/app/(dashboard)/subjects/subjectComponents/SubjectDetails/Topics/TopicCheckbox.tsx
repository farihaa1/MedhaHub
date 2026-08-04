"use client"

import { Check } from "lucide-react"

import { color } from "@/app/type"
import { getTheme } from "@/app/data/colorPalete"

interface TopicCheckboxProps {
  checked: boolean
  disabled?: boolean
  onChange: () => void
  color: color
}

export default function TopicCheckbox({
  checked,
  disabled = false,
  onChange,
  color,
}: TopicCheckboxProps) {
  const theme = getTheme(color.name)
  
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
        checked
          ? `${theme.button} ${theme.border} text-white`
          : `border-white/20 bg-transparent ${theme.hover}`
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <Check
        size={14}
        className={`transition ${
          checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </button>
  )
}
