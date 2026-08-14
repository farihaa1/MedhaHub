export default function QuestionBanksLoading() {
  return (
    <div className="grid gap-x-20 gap-y-3 md:grid-cols-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}
