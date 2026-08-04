"use client"

import { Badge } from "@/components/ui/badge"
import { QuestionDifficulty } from "@/app/redux/api/questionsApi"

interface DifficultyBadgeProps {
  difficulty?: QuestionDifficulty | string
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  if (!difficulty) {
    return <Badge variant="outline">Unknown</Badge>
  }

  switch (difficulty.toUpperCase()) {
    case QuestionDifficulty.EASY:
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
          Easy
        </Badge>
      )

    case QuestionDifficulty.MEDIUM:
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300">
          Medium
        </Badge>
      )

    case QuestionDifficulty.HARD:
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">
          Hard
        </Badge>
      )

    default:
      return <Badge variant="outline">{difficulty}</Badge>
  }
}
