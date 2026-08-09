"use client"

import { useState } from "react"

import QuestionLocationSelector, {
  QuestionLocation,
} from "./QuestionLocationSelector"

import QuestionCreateForm from "./QuestionCreateForm"
import JsonQuestionsCreateForm from "./JsonQuestionsCreateForm"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { FileQuestion, Braces, Sparkles } from "lucide-react"

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
    <main className="min-h-screen bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* PAGE HEADER */}
        <div className="">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">

              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  প্রশ্ন তৈরি করুন
                </h1>

                <p className="mt-1 text-xs text-muted-foreground">
                  নতুন MCQ প্রশ্ন তৈরি করে পর্যালোচনার জন্য জমা দিন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              <Sparkles className="size-4" />
              <span>প্রশ্ন প্রকাশের আগে পর্যালোচনা করা হবে</span>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <section className="py-8">
          <div className="mb-5">

            <p className="mt-1 text-sm text-muted-foreground">
              কোন বিষয়, অধ্যায় এবং টপিকের জন্য প্রশ্নটি তৈরি করছেন তা নির্বাচন
              করুন।
            </p>
          </div>

          <QuestionLocationSelector value={location} onChange={setLocation} />
        </section>

        {/* QUESTION TYPE */}
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5">

            <p className="mt-1 text-sm text-muted-foreground">
              একটি প্রশ্ন হাতে তৈরি করুন অথবা একসাথে একাধিক প্রশ্ন JSON-এর
              মাধ্যমে যোগ করুন।
            </p>
          </div>

          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-muted p-1">
              <TabsTrigger
                value="form"
                className="gap-2 rounded-lg py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileQuestion className="size-4" />
                <span>একটি প্রশ্ন</span>
              </TabsTrigger>

              <TabsTrigger
                value="json"
                className="gap-2 rounded-lg py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Braces className="size-4" />
                <span>JSON ইমপোর্ট</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="mt-6">
              <QuestionCreateForm location={location} />
            </TabsContent>

            <TabsContent value="json" className="mt-6">
              <JsonQuestionsCreateForm location={location} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  )
}
