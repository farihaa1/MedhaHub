import type { ProgressColor } from "./progressColors"

interface SubjectProgress {
  id: number
  subject: string
  completed: number
  total: number
  progress: number
  color: ProgressColor
}

export const subjectProgress: SubjectProgress[] = [
  {
    id: 1,
    subject: "বাংলা",
    completed: 620,
    total: 1000,
    progress: 62,
    color: "green",
  },
  {
    id: 2,
    subject: "ইংরেজি",
    completed: 410,
    total: 1000,
    progress: 41,
    color: "blue",
  },
  {
    id: 3,
    subject: "গণিত",
    completed: 280,
    total: 1000,
    progress: 28,
    color: "orange",
  },
  {
    id: 4,
    subject: "সাধারণ জ্ঞান",
    completed: 730,
    total: 1000,
    progress: 73,
    color: "purple",
  },
  {
    id: 5,
    subject: "আইসিটি",
    completed: 550,
    total: 800,
    progress: 69,
    color: "pink",
  },
]
