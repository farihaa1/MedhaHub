"use client"

import { Check } from "lucide-react"

interface TopicCheckboxProps {
  checked: boolean
  disabled?: boolean
  onChange: () => void
}

export default function TopicCheckbox({
  checked,
  disabled = false,
  onChange,
}: TopicCheckboxProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={checked ? "টপিক নির্বাচন বাতিল করুন" : "টপিক নির্বাচন করুন"}
      aria-pressed={checked}
      onClick={(event) => {
        event.stopPropagation()
        onChange()
      }}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-transparent hover:bg-muted"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <Check
        className={`h-3 w-3 transition-transform ${
          checked ? "scale-100" : "scale-0"
        }`}
      />
    </button>
  )
}
