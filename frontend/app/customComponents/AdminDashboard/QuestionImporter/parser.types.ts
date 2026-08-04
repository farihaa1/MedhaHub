export interface ParsedOption {
  text: string
  image: string | null
  isCorrect: boolean
}

export interface ParsedQuestion {
  questionText: string
  questionImage: string | null

  options: ParsedOption[]

  explanation: string
  explanationImage: string | null

  answer: "ক" | "খ" | "গ" | "ঘ"

  subjectId?: string
  chapterId?: string | null
  topicId?: string | null

  difficulty?: string

  tags?: string[]
}
