import SubjectChapters from "@/app/customComponents/PublicComponents/Subjects/SubjectChapters"

interface SubjectPageProps {
  params: Promise<{
    subjectSlug: string
  }>
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subjectSlug } = await params

  return (
    <main>
      <SubjectChapters subjectSlug={subjectSlug} />
    </main>
  )
}
