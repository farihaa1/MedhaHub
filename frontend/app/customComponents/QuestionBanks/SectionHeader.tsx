interface Props {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: Props) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold">{title}</h2>

      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
