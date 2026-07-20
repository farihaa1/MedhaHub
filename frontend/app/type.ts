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
    signup: SignupButton
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

export interface Chapter {
  id: string
  subjectId: string
  title: string
  slug: string
  order: number
  status: "draft" | "approved"
  totalTopics: number
  totalQuestions: number
  progress: number
  userId?:string
}

// export interface Question {
//   id: string
//   subjectId: string
//   chapterId: string
//   topicId: string
//   question: string
//   options: {
//     id: string
//     text: string
//   }[]
//   correctOptionId: string
//   explanation: string
//   source: string
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
// }
export interface color {
  name: string
  bg: string
  border: string
  progress: string
}
