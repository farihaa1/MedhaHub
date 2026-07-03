import { subjects } from "@/app/data/subjects"
import SubjectCard from "./SubjectCard"

export default function SubjectGrid() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  )
}
