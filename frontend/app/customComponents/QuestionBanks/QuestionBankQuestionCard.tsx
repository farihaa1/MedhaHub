import { IQuestionBankQuestion } from "@/app/redux/types/questionBank.types"

interface Props {
  item: IQuestionBankQuestion
  index: number
}

export default function QuestionBankQuestionCard({ item, index }: Props) {
  const question = item.question

  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
          {index + 1}
        </div>

        <p className="leading-7 font-medium">{question.questionText}</p>
      </div>

      <div className="grid gap-2 text-sm md:grid-cols-3">
        <div>
          <strong>Subject:</strong> {question.subjectId.title}
        </div>

        <div>
          <strong>Chapter:</strong> {question.chapterId.title}
        </div>

        <div>
          <strong>Topic:</strong> {question.topicId.title}
        </div>
      </div>
    </div>
  )
}
