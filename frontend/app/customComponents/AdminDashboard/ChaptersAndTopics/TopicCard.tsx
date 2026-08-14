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
    <div className="pl-8">
      <Card className="border-none p-0 outline-none">
        <CardContent className="flex items-center justify-between gap-4">
          {/* বাম পাশ */}
          <div className="flex min-w-0 items-center gap-3">
            <BookOpen className="h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0">
              <h4 className="truncate text-xs font-medium">{topic.title}</h4>
            </div>
          </div>

          {/* ডান পাশ */}
          <div className="flex shrink-0 items-center gap-2">
            {/* প্রশ্ন সংখ্যা */}
            <Badge variant="secondary" className="text-[10px]">
              {topic.totalQuestions ?? 0}টি প্রশ্ন
            </Badge>

            {/* স্ট্যাটাস */}
            <Badge
              className="px-2 text-[10px] text-muted-foreground"
              variant={
                topic.status === TopicStatus.APPROVED ? "default" : "secondary"
              }
            >
              {topic.status === TopicStatus.APPROVED ? "অনুমোদিত" : "খসড়া"}
            </Badge>

            {/* মেনু */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="বিষয়ের অপশন">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {/* সম্পাদনা */}
                <EditTopicDialog topic={topic}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    বিষয় সম্পাদনা
                  </DropdownMenuItem>
                </EditTopicDialog>

                {/* স্থানান্তর */}
                <MoveTopicDialog topic={topic}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    বিষয় স্থানান্তর
                  </DropdownMenuItem>
                </MoveTopicDialog>

                {/* একীভূত */}
                <MergeTopicDialog topic={topic}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <GitMerge className="mr-2 h-4 w-4" />
                    বিষয় একীভূত করুন
                  </DropdownMenuItem>
                </MergeTopicDialog>

                {/* আর্কাইভ */}
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  বিষয় আর্কাইভ করুন
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* মুছে ফেলা */}
                <DeleteTopicDialog topic={topic}>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    বিষয় মুছে ফেলুন
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
