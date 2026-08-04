import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  valueColor?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor = "text-foreground",
}: StatCardProps) {
  return (
    <Card className="border-border/60 bg-card p-0 gap-0">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-13 w-13 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground">
            {title}
          </p>

          <h2 className={`text-xl font-bold ${valueColor}`}>
            {value}
          </h2>

          <p className="text-[10px] text-muted-foreground">
            {subtitle}
          </p>
        </div>

      </CardContent>
    </Card>
  )
}