"use client"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"
import QuestionBankCard from "./QuestionBankCard"

interface Props {
  banks: IQuestionBank[]
}

export default function QuestionBanksGrid({ banks }: Props) {
  return (
    <section className="grid gap-x-20 gap-y-3 md:grid-cols-2">
      {banks.map((bank) => (
        <QuestionBankCard key={bank._id} bank={bank} />
      ))}
    </section>
  )
}
