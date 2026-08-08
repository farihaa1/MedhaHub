import { Auth, Logo, MenuItem } from "@/app/type"
import {
  BookOpen,
  ClipboardCheck,
  Trophy,
  Users,
  GraduationCap,
  FileQuestion,
  BarChart3,
  Newspaper,
  Library,
} from "lucide-react"

export const logo: Logo = {
  url: "/",
  src: "/medhahub-logo1.png",
  alt: "মেধাহাব লোগো",
  title: "মেধাহাব",
}

export const menu: MenuItem[] = [
  

  // ─────────────────────────────────────
  // Practice
  // ─────────────────────────────────────
  {
    title: "অনুশীলন",
    url: "/practice",
  },

  // ─────────────────────────────────────
  // Question Banks
  // ─────────────────────────────────────
  {
    title: "প্রশ্নব্যাংক",
    url: "/question-banks",
  },

  // ─────────────────────────────────────
  // Mock Exams
  // ─────────────────────────────────────
  {
    title: "মডেল পরীক্ষা",
    url: "/mock-exams",
  },

  // ─────────────────────────────────────
  // Current Affairs
  // ─────────────────────────────────────
  {
    title: "সাম্প্রতিক তথ্য",
    url: "/current-affairs",
  },

  
  { title: "ড্যাশবোর্ড", url: "/dashboard" },

  // ─────────────────────────────────────
  // Pricing
  // ─────────────────────────────────────
  // {
  //   title: "মূল্য পরিকল্পনা",
  //   url: "/pricing",
  // },
]

export const auth: Auth = {
  login: {
    title: "লগইন",
    url: "/login",
  },
  signup: {
    title: "signup",
    url: "/signup",
  },
}
