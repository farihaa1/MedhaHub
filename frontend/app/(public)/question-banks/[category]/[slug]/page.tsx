import QuestionBankDetails from "@/app/customComponents/QuestionBanks/QuestionBankDetails"

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export default async function QuestionBankPage({ params }: PageProps) {
  const { slug } = await params


  return <QuestionBankDetails slug={slug} />
}
