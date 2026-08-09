import { color } from "@/app/type"

export type SubjectSlug = string
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
