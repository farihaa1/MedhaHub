import SubjectPracticeClient from "./SubjectPracticeClient"
import { SubjectSlug } from "../subjects.type"

interface Props {
  params: Promise<{
    subjectSlug: SubjectSlug
  }>
}

export default async function SubjectPage({ params }: Props) {
  const { subjectSlug } = await params
  return <SubjectPracticeClient subjectSlug={subjectSlug} />
}
