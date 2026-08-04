import { SubjectSlug } from "../type"

export const mockUserData: {
  id: string
  name: string
  progress: Record<SubjectSlug, number>
} = {
  id: "user_01",
  name: "Fariha",

  progress: {
    "current-affairs": 45,
    "bangla-grammar": 72,
    "english-language": 60,
    "general-science": 40,
    "international-affairs": 55,
    "ethics-values": 30,
    "mental-ability": 52,
    "registration-school": 20,
    "bangla-literature": 73,
    "english-literature": 50,
    "mathematical-reasoning": 66,
    "bangladesh-affairs": 68,
    "geography-disaster": 48,
    ict: 78,
    "registration-college": 25,
  },
}

export function getSubjectProgress(slug: SubjectSlug) {
  return mockUserData.progress[slug] ?? 0
}