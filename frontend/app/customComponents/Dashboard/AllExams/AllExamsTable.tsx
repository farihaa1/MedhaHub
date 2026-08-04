import { Exam } from "@/app/type"
import React from "react"


interface AllExamsTableProps {
  exams: Exam[]
}

export default function AllExamsTable({ exams }: AllExamsTableProps) {
  return (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs text-gray-400">
        <thead>
          <tr className="border-b border-gray-800 font-medium text-gray-500">
            <th className="px-4 py-3 text-left">পরীক্ষার নাম</th>
            <th className="px-2 py-3">ধরন</th>
            <th className="px-2 py-3">স্ট্যাটাস</th>
            <th className="px-2 py-3">তারিখ</th>
            <th className="px-2 py-3">প্রশ্ন</th>
            <th className="px-2 py-3">সময়</th>
            <th className="px-2 py-3 text-center">Accuracy</th>
            <th className="px-4 py-3 text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr
              key={exam.id}
              className="border-b border-gray-800/40 transition-colors hover:bg-gray-800/10"
            >
              <td className="px-4 py-4 font-medium text-gray-200">
                {exam.title}
              </td>
              <td className="px-2 py-4">
                <span className="rounded border border-blue-900/50 bg-blue-950/40 px-2 py-0.5 text-[10px] text-blue-400">
                  {exam.type}
                </span>
              </td>
              <td className="px-2 py-4">
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] ${
                    exam.difficulty === "প্রিমিয়াম"
                      ? "border-amber-900/50 bg-amber-950/40 text-amber-500"
                      : "border-emerald-900/50 bg-emerald-950/40 text-emerald-400"
                  }`}
                >
                  {exam.difficulty}
                </span>
              </td>
              <td className="px-2 py-4 text-gray-500">{exam.date}</td>
              <td className="px-2 py-4 text-gray-300">{exam.participants}</td>
              <td className="px-2 py-4 text-gray-300">{`${exam.questions} প্রশ্ন • ${exam.duration}`}</td>
              <td className="px-2 py-4 text-center font-semibold text-gray-200">
                {exam.accuracy}%
              </td>
              <td className="px-4 py-4 text-right">
                <button className="rounded bg-[#055136] px-4 py-1.5 text-[11px] font-medium whitespace-nowrap text-white transition-colors hover:bg-[#04402a]">
                  পরীক্ষা দিন
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination View */}
      <div className="mt-8 flex items-center justify-center gap-1">
        <button className="flex h-7 w-7 items-center justify-center rounded bg-[#055136] text-xs text-white">
          1
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded text-xs text-gray-500 hover:text-white">
          2
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded text-xs text-gray-500 hover:text-white">
          3
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded text-xs text-gray-500 hover:text-white">
          4
        </button>
        <span className="px-1 text-xs text-gray-600">...</span>
        <button className="flex h-7 w-7 items-center justify-center rounded text-xs text-gray-500 hover:text-white">
          20
        </button>
        <button className="ml-1 flex h-7 w-7 items-center justify-center rounded text-xs text-gray-500 hover:text-white">
          &gt;
        </button>
      </div>
    </div>
  )
}
