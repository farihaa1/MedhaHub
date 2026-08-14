import { questionBankCategories } from "@/lib/questionBankCategories"

import CategoryCard from "./CategoryCard"
import SectionHeader from "./SectionHeader"

export default function QuestionBanksCategories() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="পরীক্ষার ধরন বেছে নিন"
        description="আপনি যে পরীক্ষার প্রশ্ন প্র্যাকটিস করতে চান, সেটি বেছে নিন।"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {questionBankCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
