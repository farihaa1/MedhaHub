export interface ExamSession {
  id: string
  subjectId: string
  topicIds: string[]
  questionIds: string[]
  totalQuestions: number
  createdAt: string
  status: "in_progress" | "completed"
}