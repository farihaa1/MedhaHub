import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

interface Props {
  title: string
  subtitle: string
  href: string
  color: string
  icon: React.ElementType
}

export function QuickAccessCard({
  title,
  subtitle,
  href,
  color,
  icon: Icon,
}: Props) {
  return (
    <Link href={href}>
      <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg p-0 m-0">
        <CardContent className="flex flex-col items-center p-4 text-center">
          <div
            className={`${color} mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:scale-110`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <h3 className="font-semibold text-sm">{title}</h3>

          <p className="mt-1 text-[10px] text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
