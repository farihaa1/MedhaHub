interface Props {
  count: number
}

export default function CategoryBadge({ count }: Props) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {count.toLocaleString("bn-BD")}+
    </span>
  )
}
