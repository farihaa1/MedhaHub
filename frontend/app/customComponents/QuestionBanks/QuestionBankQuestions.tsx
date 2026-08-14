import { IQuestionBankQuestion } from "@/app/redux/types/questionBank.types"
import QuestionBankQuestionCard from "./QuestionBankQuestionCard"

interface Props {
  questions: IQuestionBankQuestion[]
  loading: boolean
}

export default function QuestionBankQuestions({ questions, loading }: Props) {
  return (
    <section>
      {loading ? (
        <div className="rounded-xl border p-10 text-center text-muted-foreground">
          প্রশ্ন লোড হচ্ছে...
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">কোনো প্রশ্ন পাওয়া যায়নি</p>

          <p className="mt-2 text-sm text-muted-foreground">
            এই প্রশ্নব্যাংকে এখনো কোনো প্রশ্ন যোগ করা হয়নি।
          </p>
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
