import { color } from "@/app/type"

// export enum SubjectSlug {
//   BANGLADESH_AFFAIRS = "bangladesh-affairs",
//   INTERNATIONAL_AFFAIRS = "international-affairs",

//   BANGLA_LANGUAGE_GRAMMAR = "bangla-language-grammar",
//   BANGLA_LITERATURE = "bangla-literature",

//   ENGLISH_LANGUAGE = "english-language",
//   ENGLISH_LITERATURE = "english-literature",

//   MATHEMATICAL_REASONING = "mathematical-reasoning",
//   GENERAL_SCIENCE = "general-science",
//   CURRENT_AFFAIRS = "current-affairs",
//   ICT = "ict",
//   MENTAL_ABILITY = "mental-ability",
//   GEOGRAPHY_DISASTER_MANAGEMENT = "geography-disaster-management",
//   ETHICS_VALUES_GOOD_GOVERNANCE = "ethics-values-good-governance",
// }

export interface ISubject {
  _id: string
  title: string
  slug: string
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
