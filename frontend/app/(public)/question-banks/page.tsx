import QuestionBanksHero from "@/app/customComponents/QuestionBanks/QuestionBanksHero"
import QuestionBanksCategories from "@/app/customComponents/QuestionBanks/QuestionBanksCategories"

export default function QuestionBanksPage() {
  return (
    <>
      <QuestionBanksHero />

      <div className="mt-12">
        <QuestionBanksCategories />
      </div>
    </>
  )
}
