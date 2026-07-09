import SubjectGrid from "@/app/(dashboard)/subjects/subjectComponents/SubjectsChoose/SubjectGrid"
import SubjectHeader from "@/app/(dashboard)/subjects/subjectComponents/SubjectsChoose/SubjectHero"

export default function ChooseSubject() {
  
  return (
    <section className="space-y-6 rounded-3xl bg-black p-8 text-white">
      <SubjectHeader />
      <SubjectGrid />
    </section>
  )
}
