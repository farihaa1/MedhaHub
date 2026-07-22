"use client"

import Link from "next/link"
import {
  AlertTriangle,
  CreditCard,
  FileQuestion,
  FileText,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pendingItems = [
  {
    id: 1,
    title: "Question Submissions",
    description: "Questions waiting for approval",
    count: 126,
    href: "/admin/question-submissions",
    icon: FileQuestion,
  },
  {
    id: 2,
    title: "Reported Questions",
    description: "Questions reported by students",
    count: 18,
    href: "/admin/reports",
    icon: AlertTriangle,
  },
  {
    id: 3,
    title: "Contributor Requests",
    description: "Pending contributor applications",
    count: 9,
    href: "/admin/contributors",
    icon: Users,
  },
  {
    id: 4,
    title: "Draft Model Tests",
    description: "Model tests waiting to publish",
    count: 7,
    href: "/admin/model-tests",
    icon: FileText,
  },
  {
    id: 5,
    title: "Pending Payments",
    description: "Payments waiting for verification",
    count: 4,
    href: "/admin/payments",
    icon: CreditCard,
  },
]

export default function PendingReviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Reviews</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {pendingItems.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-medium">{item.title}</h3>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="destructive">{item.count}</Badge>

                <Button asChild size="sm" variant="outline">
                  <Link href={item.href}>View</Link>
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
