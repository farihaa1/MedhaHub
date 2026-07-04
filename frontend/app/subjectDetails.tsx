export interface SubjectDetails {
  id: string
  title: string
  slug: string
  url?: string
  description?: string
  icon?: string
  color?: string
  totalChapters?: number
  totalTopics?: number
  totalQuestions?: number
  estimatedHours?: number
  examsCount?: number
}
export const subjectDetails: SubjectDetails[] = [
  {
    id: "sub_01",
    title: "বাংলা ভাষা ও ব্যাকরণ",
    slug: "bangla-grammar",
    url: "/bangla-grammar",
    description:
      "অধ্যায়ভিত্তিক বাংলা ব্যাকরণ অনুশীলন করুন, অগ্রগতি ট্র্যাক করুন এবং কাস্টম পরীক্ষা তৈরি করুন।",
    totalChapters: 12,
    totalTopics: 74,
    totalQuestions: 9842,
    estimatedHours: 38,
    examsCount: 180,
  },
  {
    id: "sub_02",
    title: "বাংলা ভাষা ও ব্যাকরণ",
    slug: "current-affairs",
    url: "/current-affairs",
    description:
      "অধ্যায়ভিত্তিক বাংলা ব্যাকরণ অনুশীলন করুন, অগ্রগতি ট্র্যাক করুন এবং কাস্টম পরীক্ষা তৈরি করুন।",
    totalChapters: 12,
    totalTopics: 74,
    totalQuestions: 9842,
    estimatedHours: 38,
    examsCount: 180,
  },
  {
    id: "sub_03",
    title: "English Language",
    slug: "english-language",
    url: "/english-language",
    description: "Practice English grammar, vocabulary and comprehension.",
    totalChapters: 15,
    totalTopics: 82,
    totalQuestions: 11200,
    estimatedHours: 42,
    examsCount: 170,
  },
]
