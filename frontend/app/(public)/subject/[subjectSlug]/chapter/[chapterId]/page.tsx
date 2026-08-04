import TopicsSection from "@/app/customComponents/PublicComponents/Subjects/TopicsSection"

interface ChapterPageProps {
  params: Promise<{
    subjectSlug: string
    chapterId: string
  }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const resolvedParams = await params

  const { subjectSlug, chapterId } = resolvedParams

  return (
    <main>
      <TopicsSection subjectSlug={subjectSlug} chapterId={chapterId} />
    </main>
  )
}
