
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
}