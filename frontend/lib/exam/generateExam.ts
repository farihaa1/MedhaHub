import { questions } from "@/app/data/questionData"
import { ExamSession } from "./type"
import { shuffleArray } from "./shuffle"

interface GenerateExamInput {
  subjectId: string
  topicIds: string[]
  questionCount: number
}

export function generateExam({
  subjectId,
  topicIds,
  questionCount,
}: GenerateExamInput): ExamSession {
  const availableQuestions = questions.filter(
    (question) => question.isActive && topicIds.includes(question.topicId)
  )

  const selectedQuestions = shuffleArray(availableQuestions).slice(
    0,
    questionCount
  )

  return {
    id: crypto.randomUUID(),

    subjectId,

    topicIds,

    questionIds: selectedQuestions.map((q) => q.id),

    totalQuestions: selectedQuestions.length,

    createdAt: new Date().toISOString(),

    status: "in_progress",
  }
}
