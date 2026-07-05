import { ReactNode } from "react"

export interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: ReactNode
  items?: MenuItem[]
}

export interface Logo {
  url: string
  src: string
  alt: string
  title: string
  className?: string
}

export interface LoginButton {
  title: string
  url: string
}

export interface SignupButton {
  title: string
  url: string
}

export interface Auth {
  login: LoginButton
  //   signup: SignupButton
}

export interface NavbarProps {
  className?: string
  logo: Logo
  menu: MenuItem[]
  auth: Auth
}

export interface Exam {
  id: string
  title: string
  type: "মডেল টেস্ট" | "প্র্যাকটিস"
  difficulty: "প্রিমিয়াম" | "সহজ"
  date: string
  participants: string
  questions: number
  duration: string
  accuracy: number
}

export type SubjectSlug =
  | "current-affairs"
  | "bangla-grammar"
  | "english-language"
  | "general-science"
  | "international-affairs"
  | "ethics-values"
  | "mental-ability"
  | "registration-school"
  | "bangla-literature"
  | "english-literature"
  | "mathematical-reasoning"
  | "bangladesh-affairs"
  | "geography-disaster"
  | "ict"
  | "registration-college"


export interface Subject {
  id: string
  title: string
  slug: SubjectSlug
  url: string
  examsCount: number
}

export interface Topic {
  id: string
  title: string
  questions: number
}

export interface Chapter {
  id: string
  title: string
  totalQuestions: number
  progress: number
  topics: Topic[]
}

export interface Chapter {
  id: string
  subjectId: string
  title: string
  slug: string
  order: number
  status: "draft" | "published" | "archived"
  totalTopics: number
  totalQuestions: number
}

export interface Question {
  id: string
  subjectId: string
  chapterId: string
  topicId: string
  question: string
  options: {
    id: string
    text: string
  }[]
  correctOptionId: string
  explanation: string
  source: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
export interface color {
  name: string
  bg: string
  border: string
  progress: string
}