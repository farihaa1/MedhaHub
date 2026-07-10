import { color } from "@/app/type"

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

export interface ISubject {
  _id: string
  title: string
  slug: SubjectSlug
  url: string
  examsCount?: number
  description?: string
  totalQuestions?: number //from question database
  totalChapters?: number //from chapter database
  completedQuestions?: number //from user database
  totalTopics?: number //from topics database
  estimatedHours?: number //from user
  color?: color
}
