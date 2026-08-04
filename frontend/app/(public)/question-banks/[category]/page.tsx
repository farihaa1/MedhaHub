import QuestionBanksContainer from "@/app/customComponents/QuestionBanks/QuestionBanksContainer"
import { TQuestionBankCategory } from "@/app/redux/types/questionBank.types"

interface PageProps {
  params: Promise<{
    category: TQuestionBankCategory
  }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params

  return <QuestionBanksContainer category={category} />
}
