import React from "react"

const tabs = ["সকল পরীক্ষা", "মডেল টেস্ট", "প্র্যাকটিস টেস্ট", "লাইভ টেস্ট"]

export default function FilterSection() {
  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex w-max rounded-lg border border-gray-800 bg-[#0d151c] p-1">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`rounded-md px-4 py-2 text-xs transition-all ${
              idx === 0
                ? "bg-[#055136] font-medium text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Select Dropdowns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "পরীক্ষার ধরন", defaultValue: "সব ধরন" },
          { label: "পরীক্ষার বিষয়", defaultValue: "সব বিষয়" },
          { label: "ক্যাটাগরি", defaultValue: "সব" },
          { label: "সর্টিং", defaultValue: "নতুন থেকে পুরোনো" },
        ].map((filter, index) => (
          <div key={index} className="space-y-2">
            <label className="text-xs text-gray-500">{filter.label}</label>
            <select className="w-full appearance-none rounded-lg border border-gray-800 bg-[#0d151c] p-2.5 text-xs text-gray-300 focus:border-green-600 focus:outline-none">
              <option>{filter.defaultValue}</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
