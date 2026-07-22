"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  BadgeCheck,
  Bot,
  CreditCard,
  FileCheck,
  GraduationCap,
  Trophy,
} from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Student Started Exam",
    description: "Rahim started BCS Preliminary Model Test 12",
    time: "2 minutes ago",
    icon: GraduationCap,
  },

  {
    id: 2,
    title: "Question Approved",
    description: "Moderator approved a Mathematics question",
    time: "5 minutes ago",
    icon: FileCheck,
  },

  {
    id: 3,
    title: "Payment Received",
    description: "Premium subscription payment ৳499 received",
    time: "12 minutes ago",
    icon: CreditCard,
  },

  {
    id: 4,
    title: "AI Generated Questions",
    description: "AI generated 50 English questions",
    time: "20 minutes ago",
    icon: Bot,
  },

  {
    id: 5,
    title: "Contributor Earned Points",
    description: "Nabila earned 100 contributor points",
    time: "30 minutes ago",
    icon: Trophy,
  },
]

export default function LiveActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-primary" />
          Live Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => {
            const Icon = activity.icon

            return (
              <div
                key={activity.id}

                className="flex items-start gap-4"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>

                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
