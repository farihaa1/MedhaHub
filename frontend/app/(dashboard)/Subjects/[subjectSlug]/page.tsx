import { notFound } from "next/navigation"

import { SubjectSlug, color } from "@/app/type"
import { subjectDetails } from "@/app/subjectDetails"
import { getSubjectColorBySlug } from "@/app/data/colorPalete"

import SubjectPracticeClient from "./SubjectPracticeClient"

interface Props {
  params: Promise<{
    subjectSlug: SubjectSlug
  }>
}

export default async function SubjectPage({ params }: Props) {
  const { subjectSlug } = await params

  const subject = subjectDetails.find((item) => item.slug === subjectSlug)

  if (!subject) {
    notFound()
  }

  const color: color = getSubjectColorBySlug(subjectSlug)
console.log(subjectSlug)
  return (
    <SubjectPracticeClient
      subject={subject}
      subjectSlug={subjectSlug}
      color={color}
    />
  )
}
