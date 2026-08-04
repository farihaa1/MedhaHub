
"use client"

import {
  ArrowRight,
  BookOpen,
  FileQuestion,
  Settings2,
} from "lucide-react"

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
    <div className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141C2D]/95 px-6 py-4 shadow-2xl backdrop-blur">
        {/* Left */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <BookOpen
                size={22}
                className="text-emerald-400"
              />
            </div>

            <div>
              <p className="text-xs text-zinc-400">
                Selected Topics
              </p>

              <p className="text-xl font-bold text-white">
                {selectedTopics}
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <FileQuestion
                size={22}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-xs text-zinc-400">
                Available Questions
              </p>

              <p className="text-xl font-bold text-white">
                {selectedQuestions}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={onGenerate}
          disabled={selectedTopics === 0}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          <Settings2 size={18} />

          Configure Exam

          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
