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
} from "lucide-react"

export const logo: Logo = {
  url: "/",
  src: "/medhahub-logo1.png",
  alt: "মেধাহাব লোগো",
  title: "মেধাহাব",
}

export const menu: MenuItem[] = [
  {
    title: "হোম",
    url: "/",
  },

  {
    title: "অনুশীলন",
    url: "/practice",
    items: [
      {
        title: "বিষয়ভিত্তিক এমসিকিউ",
        description: "বিষয় অনুযায়ী এমসিকিউ অনুশীলন করুন।",
        icon: <BookOpen className="size-5 shrink-0" />,
        url: "/practice/subjects",
      },
      {
        title: "টপিকভিত্তিক অনুশীলন",
        description: "একটি করে টপিক ভালোভাবে আয়ত্ত করুন।",
        icon: <GraduationCap className="size-5 shrink-0" />,
        url: "/practice/topics",
      },
      {
        title: "দৈনিক কুইজ",
        description: "প্রতিদিন নতুন একটি কুইজ দিন।",
        icon: <ClipboardCheck className="size-5 shrink-0" />,
        url: "/daily-quiz",
      },
      {
        title: "পূর্ববর্তী প্রশ্ন",
        description: "বিগত বছরের পরীক্ষার প্রশ্ন সমাধান করুন।",
        icon: <FileQuestion className="size-5 shrink-0" />,
        url: "/previous-questions",
      },
    ],
  },

  {
    title: "মডেল পরীক্ষা",
    url: "/mock-exams",
    items: [
      {
        title: "বিসিএস",
        description: "পূর্ণাঙ্গ বিসিএস মডেল টেস্ট দিন।",
        icon: <ClipboardCheck className="size-5 shrink-0" />,
        url: "/mock-exams/bcs",
      },
      {
        title: "ব্যাংক চাকরি",
        description: "ব্যাংক নিয়োগ পরীক্ষার প্রস্তুতি নিন।",
        icon: <BarChart3 className="size-5 shrink-0" />,
        url: "/mock-exams/bank",
      },
      {
        title: "প্রাথমিক শিক্ষক",
        description: "প্রাথমিক সহকারী শিক্ষক নিয়োগ প্রস্তুতি।",
        icon: <GraduationCap className="size-5 shrink-0" />,
        url: "/mock-exams/primary",
      },
      {
        title: "কাস্টম পরীক্ষা",
        description: "নিজের পছন্দমতো একটি মডেল পরীক্ষা তৈরি করুন।",
        icon: <FileQuestion className="size-5 shrink-0" />,
        url: "/mock-exams/custom",
      },
    ],
  },

  {
    title: "সাম্প্রতিক তথ্য",
    url: "/current-affairs",
    items: [
      {
        title: "দৈনিক সংবাদ",
        description: "পরীক্ষার জন্য গুরুত্বপূর্ণ সাম্প্রতিক তথ্য।",
        icon: <Newspaper className="size-5 shrink-0" />,
        url: "/current-affairs/daily",
      },
      {
        title: "মাসিক সংকলন",
        description: "মাসজুড়ে গুরুত্বপূর্ণ সাম্প্রতিক তথ্য একসাথে।",
        icon: <BookOpen className="size-5 shrink-0" />,
        url: "/current-affairs/monthly",
      },
    ],
  },

  {
    title: "কমিউনিটি",
    url: "/community",
    items: [
      {
        title: "আলোচনা ফোরাম",
        description: "প্রশ্ন করুন এবং অন্যদের সাথে আলোচনা করুন।",
        icon: <Users className="size-5 shrink-0" />,
        url: "/community/forum",
      },
      {
        title: "এমসিকিউ যোগ করুন",
        description: "নিজের তৈরি এমসিকিউ জমা দিন।",
        icon: <FileQuestion className="size-5 shrink-0" />,
        url: "/community/contribute",
      },
      {
        title: "সেরা অবদানকারী",
        description: "সর্বোচ্চ রেটিংপ্রাপ্ত অবদানকারীদের দেখুন।",
        icon: <Trophy className="size-5 shrink-0" />,
        url: "/community/contributors",
      },
    ],
  },

  {
    title: "মূল্য পরিকল্পনা",
    url: "/pricing",
  },
]

export const auth: Auth = {
  login: {
    title: "লগইন",
    url: "/login",
  },
  // signup: {
  //   title: "শুরু করুন",
  //   url: "/signup",
  // },
}
