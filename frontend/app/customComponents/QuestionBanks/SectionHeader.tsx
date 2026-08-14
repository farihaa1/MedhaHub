interface Props {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: Props) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>

      {description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
