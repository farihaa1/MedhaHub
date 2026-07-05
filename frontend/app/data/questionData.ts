import { Question } from "../type"

export const questions: Question[] = [
  {
    id: "q_001",
    topicId: "tp_01",
    question: "বাংলা ভাষার প্রাচীনতম নিদর্শন কোনটি?",
    options: [
      { id: "A", text: "শ্রীকৃষ্ণকীর্তন" },
      { id: "B", text: "চর্যাপদ" },
      { id: "C", text: "মঙ্গলকাব্য" },
      { id: "D", text: "গীতাঞ্জলি" },
    ],
    correctOptionId: "B",
    explanation: "চর্যাপদ বাংলা ভাষার প্রাচীনতম লিখিত নিদর্শন।",
    source: "BCS",
    isActive: true,
    createdAt: "2026-07-05T00:00:00Z",
    updatedAt: "2026-07-05T00:00:00Z",
  },

  {
    id: "q_002",
    topicId: "tp_01",
    question: "'অমিত্রাক্ষর ছন্দ' প্রথম ব্যবহার করেন কে?",
    options: [
      { id: "A", text: "মাইকেল মধুসূদন দত্ত" },
      { id: "B", text: "রবীন্দ্রনাথ ঠাকুর" },
      { id: "C", text: "কাজী নজরুল ইসলাম" },
      { id: "D", text: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়" },
    ],
    correctOptionId: "A",
    explanation:
      "বাংলা সাহিত্যে অমিত্রাক্ষর ছন্দের প্রবর্তক মাইকেল মধুসূদন দত্ত।",
    source: "BCS",
    isActive: true,
    createdAt: "2026-07-05T00:00:00Z",
    updatedAt: "2026-07-05T00:00:00Z",
  },
]
