interface Props {
  category: {
    title: string
    description: string
    questionCount: number
  }
}

export default function QuestionBanksHeader({ category }: Props) {
  return (
    <section className="bg-card p-8">
      <h1 className="text-3xl font-bold sm:text-4xl">{category.title}</h1>

      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
        {category.description}
      </p>

      <div className="mt-5 inline-flex rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary">
        {category.questionCount.toLocaleString("bn-BD")}+ প্রশ্ন
      </div>
    </section>
  )
}
