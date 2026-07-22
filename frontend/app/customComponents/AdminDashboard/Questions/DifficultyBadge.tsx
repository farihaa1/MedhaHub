"use client"

import { Badge } from "@/components/ui/badge"

import { QuestionDifficulty } from "@/app/redux/api/questionsApi"

interface Props {
  difficulty?: QuestionDifficulty
}

export default function DifficultyBadge({ difficulty }: Props) {
  if (difficulty === QuestionDifficulty.EASY) {
    return <Badge>Easy</Badge>
  }

  if (difficulty === QuestionDifficulty.MEDIUM) {
    return <Badge variant="secondary">Medium</Badge>
  }

  return <Badge variant="destructive">Hard</Badge>
}
