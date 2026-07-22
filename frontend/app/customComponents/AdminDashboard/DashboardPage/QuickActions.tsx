"use client"

import {
  Plus,
  FileQuestion,
  BookOpen,
  ClipboardPlus,
  Megaphone,
  Sparkles,
  CheckCircle,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

const actions = [
  {
    title: "Create Question",
    description: "Add a new MCQ question",
    icon: FileQuestion,
    href: "/admin/questions/create",
  },

  {
    title: "Create Subject",
    description: "Add new subject",
    icon: BookOpen,
    href: "/admin/subjects/create",
  },

  {
    title: "Create Model Test",
    description: "Create exam test",
    icon: ClipboardPlus,
    href: "/admin/model-tests/create",
  },

  {
    title: "Publish Notice",
    description: "Create announcement",
    icon: Megaphone,
    href: "/admin/notices/create",
  },

  {
    title: "Review Questions",
    description: "Approve submissions",
    icon: CheckCircle,
    href: "/admin/question-submissions",
  },

  {
    title: "Generate AI Questions",
    description: "Create questions using AI",
    icon: Sparkles,
    href: "/admin/ai-generator",
  },
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon

            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto justify-start p-4"
                asChild
              >
                <a href={action.href}>
                  <div className="mr-4 rounded-lg bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="text-left">
                    <p className="font-semibold">{action.title}</p>

                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
