import { questionBankCategories } from "@/lib/questionBankCategories"

import CategoryCard from "./CategoryCard"
import SectionHeader from "./SectionHeader"

export default function QuestionBanksCategories() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="সকল ক্যাটাগরি"
        description="আপনার পছন্দের পরীক্ষার প্রশ্ন ব্যাংক নির্বাচন করুন।"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {questionBankCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
