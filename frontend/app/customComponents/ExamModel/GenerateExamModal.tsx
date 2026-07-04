"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void

  maxQuestions: number

  onGenerate: (questionCount: number) => void
}

export default function GenerateExamModal({
  open,
  onOpenChange,
  maxQuestions,
  onGenerate,
}: Props) {
  const [count, setCount] = useState(Math.min(20, maxQuestions))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#111827] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Practice Exam</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <p className="mb-2 text-sm text-gray-400">Available Questions</p>

            <div className="rounded-lg bg-white/5 p-4 text-center text-3xl font-bold">
              {maxQuestions}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm">Number of Questions</label>

            <input
              type="range"
              min={10}
              max={maxQuestions}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-400">10</span>

              <span className="rounded-lg bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-400">
                {count} Questions
              </span>

              <span className="text-sm text-gray-400">{maxQuestions}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm">Or enter manually</label>

            <input
              type="number"
              min={10}
              max={maxQuestions}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-white/10 px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => onGenerate(count)}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-white transition hover:bg-emerald-600"
          >
            Start Exam
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
