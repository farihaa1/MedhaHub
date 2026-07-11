"use client"

import { IQuestionOption } from "@/app/redux/api/api.type"


interface Props {
  options: IQuestionOption[]
  selected?: string
  onSelect: (optionId: string) => void
}

export default function OptionList({ options, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option._id}
          className="flex cursor-pointer items-center gap-3 rounded-lg border p-4"
        >
          <input
            type="radio"
            checked={selected === option._id}
            onChange={() => onSelect(option._id)}
          />

          <span>{option.text}</span>
        </label>
      ))}
    </div>
  )
}
