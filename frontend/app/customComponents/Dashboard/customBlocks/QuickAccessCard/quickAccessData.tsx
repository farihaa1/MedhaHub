import {
  BookOpen,
  FileQuestion,
  Brain,
  ClipboardList,
  Trophy,
  Bot,
} from "lucide-react"

export const quickAccess = [
  {
    title: "বিষয়সমূহ",
    subtitle: "বিষয়ভিত্তিক প্রস্তুতি",
    href: "/subjects",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    title: "প্রশ্নব্যাংক",
    subtitle: "সকল এমসিকিউ দেখুন",
    href: "/question-bank",
    icon: FileQuestion,
    color: "bg-orange-500",
  },
  {
    title: "সকল পরীক্ষা",
    subtitle: "মডেল ও প্র্যাকটিস টেস্ট",
    href: "/exams",
    icon: ClipboardList,
    color: "bg-blue-500",
  },
  {
    title: "দ্রুত পরীক্ষা",
    subtitle: "৩০ সেকেন্ডে শুরু করুন",
    href: "/practice",
    icon: Brain,
    color: "bg-pink-500",
  },
  {
    title: "লিডারবোর্ড",
    subtitle: "র‍্যাঙ্কিং দেখুন",
    href: "/leaderboard",
    icon: Trophy,
    color: "bg-yellow-500",
  },
  {
    title: "AI সহায়ক",
    subtitle: "যেকোনো প্রশ্ন করুন",
    href: "/chat-ai",
    icon: Bot,
    color: "bg-violet-500",
  },
]
