"use client"

import {
  Archive,
  ArrowRightLeft,
  BookOpen,
  GitMerge,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import EditTopicDialog from "./EditTopicDialog"
import DeleteTopicDialog from "./DeleteTopicDialog"
import MoveTopicDialog from "./MoveTopicDialog"
import MergeTopicDialog from "./MergeTopicDialog"

import { ITopic, TopicStatus } from "@/app/redux/api/topicsApi"

interface Props {
  topic: ITopic
}

export default function TopicCard({ topic }: Props) {
  return (
    <div className="py-2 pl-8">
      <Card className="border-none p-0 outline-none">
        <CardContent className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <BookOpen className="h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0">
              <h4 className="truncate text-[10px] font-medium">
                {topic.title}
              </h4>
            </div>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {topic.totalQuestions ?? 0} Questions
            </Badge>

            <Badge
              className="px-2 text-[10px] text-muted-foreground"
              variant={
                topic.status === TopicStatus.APPROVED ? "default" : "secondary"
              }
            >
              {topic.status}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <EditTopicDialog topic={topic}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Topic
                  </DropdownMenuItem>
                </EditTopicDialog>

                <MoveTopicDialog topic={topic}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Move Topic
                  </DropdownMenuItem>
                </MoveTopicDialog>

                <MergeTopicDialog topic={topic}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <GitMerge className="mr-2 h-4 w-4" />
                    Merge Topic
                  </DropdownMenuItem>
                </MergeTopicDialog>

                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Topic
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DeleteTopicDialog topic={topic}>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Topic
                  </DropdownMenuItem>
                </DeleteTopicDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
