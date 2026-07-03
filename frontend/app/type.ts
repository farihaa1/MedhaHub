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


  // Subject (PURE BUSINESS ENTITY)
  export interface Subject {
    id: string
    title: string
    slug: SubjectSlug
    url: string
    examsCount: number
  }