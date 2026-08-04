import { IQuestionBankQuestion } from "@/app/redux/types/questionBank.types"
import QuestionBankQuestionCard from "./QuestionBankQuestionCard"

interface Props {
  questions: IQuestionBankQuestion[]
  loading: boolean
}

export default function QuestionBankQuestions({ questions, loading }: Props) {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">Questions</h2>

      {loading ? (
        <div className="rounded-xl border p-10 text-center">
          Loading Questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          No questions available
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((item, index) => (
            <QuestionBankQuestionCard
              key={item._id}
              item={item}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  )
}
