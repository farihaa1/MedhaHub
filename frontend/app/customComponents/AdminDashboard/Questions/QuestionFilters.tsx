"use client"

import SearchQuestion from "./SearchQuestion"
import SubjectFilter from "./SubjectFilter"
import ChapterFilter from "./ChapterFilter"
import TopicFilter from "./TopicFilter"
import DifficultyFilter from "./DifficultyFilter"
import StatusFilter from "./StatusFilter"
import ClearFiltersButton from "./ClearFiltersButton"

export default function QuestionFilters() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SearchQuestion />

        <SubjectFilter />

        <ChapterFilter />

        <TopicFilter />

        <DifficultyFilter />

        <StatusFilter />

        <ClearFiltersButton />
      </div>
    </div>
  )
}
