"use client"

import { useState } from "react"

import QuestionLocationSelector, {
  QuestionLocation,
} from "./QuestionLocationSelector"

import QuestionCreateForm from "./QuestionCreateForm"

import JsonQuestionsCreateForm from "./JsonQuestionsCreateForm"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const initialLocation: QuestionLocation = {
  subjectId: "",

  chapterId: "",

  topicId: "",

  suggestedChapterTitle: "",

  suggestedTopicTitle: "",
}

export default function QuestionCreatePage() {
  const [location, setLocation] = useState<QuestionLocation>(initialLocation)

  return (
    <section className="space-y-6 rounded-3xl bg-background p-6">
      <div className="text-center">
        <h1 className="text-lg">Create Question</h1>

        <p className="pt-1 pb-3 text-sm text-muted-foreground">
          Submit a new MCQ question. It will be reviewed before publishing.
        </p>
      </div>

      {/* COMMON LOCATION */}

      <QuestionLocationSelector
        value={location}

        onChange={setLocation}
      />

      {/* QUESTION TYPE */}

      <Tabs defaultValue="form" className="w-full border-none">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="m-0 border-none p-0" value="form">
            Single Question
          </TabsTrigger>

          <TabsTrigger className="m-0 border-none p-0" value="json">
            JSON Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <QuestionCreateForm location={location} />
        </TabsContent>

        <TabsContent value="json">
          <JsonQuestionsCreateForm location={location} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
