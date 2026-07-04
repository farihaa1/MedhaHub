"use client"

import { BookOpen, FileQuestion } from "lucide-react"

interface Props {
  selectedTopics: number
  selectedQuestions: number
  onGenerate: () => void
}

export default function SelectedTopicsSummary({
  selectedTopics,
  selectedQuestions,
  onGenerate,
}: Props) {
  return (
    <div className="sticky bottom-5 z-20 rounded-2xl border border-white/10 bg-[#141C2D]/95 p-5 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <BookOpen size={20} className="text-emerald-400" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Selected Topics</p>

              <h3 className="text-xl font-semibold text-white">
                {selectedTopics}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-3">
              <FileQuestion size={20} className="text-cyan-400" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Available Questions</p>

              <h3 className="text-xl font-semibold text-white">
                {selectedQuestions}
              </h3>
            </div>
          </div>
        </div>

        <button
          disabled={selectedTopics === 0}
          onClick={onGenerate}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          Generate Practice Exam
        </button>
      </div>
    </div>
  )
}
