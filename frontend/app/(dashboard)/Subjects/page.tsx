import SubjectGrid from "@/app/customComponents/SubjectsChoose/SubjectGrid"
import SubjectHeader from "@/app/customComponents/SubjectsChoose/SubjectHero"

export default function ChooseSubject() {
  return (
    <section className="space-y-6 rounded-3xl bg-black p-8 text-white">
      <SubjectHeader />
      <SubjectGrid />
    </section>
  )
}
