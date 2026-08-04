export interface QuestionBankCategory {
  id: number
  slug: string
  title: string
  description: string
  questionCount: number
}

export const questionBankCategories: QuestionBankCategory[] = [
  {
    id: 1,
    slug: "bcs",
    title: "বিসিএস (BCS)",
    description: "প্রিলিমিনারি, লিখিত, ভাইভা ও বিশেষ বিসিএস",
    questionCount: 10000,
  },
  {
    id: 2,
    slug: "psc-non-cadre",
    title: "পিএসসি নন-ক্যাডার",
    description:
      "বাংলাদেশ সরকারি কর্ম কমিশন (PSC) পরিচালিত নন-ক্যাডার নিয়োগ পরীক্ষা",
    questionCount: 8000,
  },
  {
    id: 3,
    slug: "bjs",
    title: "বাংলাদেশ জুডিশিয়াল সার্ভিস (BJS)",
    description: "সহকারী জজ ও বিচার বিভাগীয় সেবার নিয়োগ পরীক্ষা",
    questionCount: 1000,
  },
  {
    id: 4,
    slug: "teacher",
    title: "শিক্ষক নিয়োগ",
    description:
      "সরকারি প্রাথমিক, মাধ্যমিক, কলেজ ও অন্যান্য শিক্ষক নিয়োগ পরীক্ষা",
    questionCount: 4000,
  },
  {
    id: 5,
    slug: "ntrca",
    title: "এনটিআরসিএ (NTRCA)",
    description: "স্কুল, স্কুল-২ ও কলেজ শিক্ষক নিবন্ধন পরীক্ষা",
    questionCount: 5000,
  },
  {
    id: 6,
    slug: "bank",
    title: "ব্যাংক ও আর্থিক প্রতিষ্ঠান",
    description:
      "বাংলাদেশ ব্যাংক, রাষ্ট্রায়ত্ত, বেসরকারি ব্যাংক ও আর্থিক প্রতিষ্ঠানের নিয়োগ পরীক্ষা",
    questionCount: 6000,
  },
  {
    id: 7,
    slug: "government",
    title: "সরকারি চাকরি",
    description:
      "মন্ত্রণালয়, অধিদপ্তর, কর্তৃপক্ষ, কমিশন, কর্পোরেশন ও স্বায়ত্তশাসিত প্রতিষ্ঠানের নিয়োগ পরীক্ষা",
    questionCount: 12000,
  },
  {
    id: 8,
    slug: "defence",
    title: "প্রতিরক্ষা ও আইনশৃঙ্খলা",
    description:
      "সেনাবাহিনী, নৌবাহিনী, বিমানবাহিনী, পুলিশ, বিজিবি, র‍্যাব, ফায়ার সার্ভিস, NSI",
    questionCount: 4000,
  },
  {
    id: 9,
    slug: "health",
    title: "স্বাস্থ্যসেবা",
    description:
      "স্বাস্থ্য অধিদপ্তর, মেডিকেল, নার্সিং ও স্বাস্থ্যসেবা সংশ্লিষ্ট নিয়োগ পরীক্ষা",
    questionCount: 3000,
  },
  {
    id: 10,
    slug: "railway",
    title: "রেলওয়ে",
    description: "বাংলাদেশ রেলওয়ের বিভিন্ন পদে নিয়োগ পরীক্ষা",
    questionCount: 1000,
  },
  {
    id: 11,
    slug: "admission",
    title: "ভর্তি পরীক্ষা",
    description:
      "বিশ্ববিদ্যালয়, মেডিকেল, প্রকৌশল, কৃষি ও অন্যান্য ভর্তি পরীক্ষা",
    questionCount: 7000,
  },
  {
    id: 12,
    slug: "others",
    title: "অন্যান্য",
    description:
      "আন্তর্জাতিক সংস্থা, বেসরকারি প্রতিষ্ঠান ও অন্যান্য প্রতিযোগিতামূলক পরীক্ষা",
    questionCount: 2000,
  },
]
