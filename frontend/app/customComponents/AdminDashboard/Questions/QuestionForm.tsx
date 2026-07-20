"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  IQuestion,
  OptionLabel,
  QuestionStatus,
} from "@/app/redux/api/questionsApi"

// TODO: Replace with your APIs
// import { useGetSubjectsQuery } from "@/app/redux/api/subjectApi"
// import { useGetChaptersQuery } from "@/app/redux/api/chapterApi"
// import { useGetTopicsQuery } from "@/app/redux/api/topicApi"

const schema = z.object({
  questionText: z.string().min(5),

  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),

  correctAnswer: z.enum(["A", "B", "C", "D"]),

  explanation: z.string().optional(),

  subjectId: z.string().min(1),
  chapterId: z.string().min(1),
  topicId: z.string().min(1),

  status: z.enum(["draft", "approved"]),

  examCategory: z.string().optional(),
  examName: z.string().optional(),
  examYear: z.coerce.number().optional(),

  tags: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  defaultValues?: IQuestion
  loading?: boolean
  onSubmit: (data: Partial<IQuestion>) => void
}

export default function QuestionForm({
  defaultValues,
  loading,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      questionText: "",

      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",

      correctAnswer: "A",

      explanation: "",

      subjectId: "",
      chapterId: "",
      topicId: "",

      status: QuestionStatus.Draft,

      examCategory: "",
      examName: "",
      examYear: undefined,

      tags: "",
    },
  })

  useEffect(() => {
    if (!defaultValues) return

    form.reset({
      questionText: defaultValues.questionText,

      optionA: defaultValues.options.find((o) => o.label === "A")?.text ?? "",

      optionB: defaultValues.options.find((o) => o.label === "B")?.text ?? "",

      optionC: defaultValues.options.find((o) => o.label === "C")?.text ?? "",

      optionD: defaultValues.options.find((o) => o.label === "D")?.text ?? "",

      correctAnswer: defaultValues.correctAnswer,

      explanation: defaultValues.explanation ?? "",

      subjectId: defaultValues.subjectId,
      chapterId: defaultValues.chapterId,
      topicId: defaultValues.topicId,

      status: defaultValues.status,

      examCategory: defaultValues.examInfo?.category,
      examName: defaultValues.examInfo?.examName,
      examYear: defaultValues.examInfo?.year,

      tags: defaultValues.tags?.join(", "),
    })
  }, [defaultValues, form])

  const submit = (values: FormValues) => {
    onSubmit({
      questionText: values.questionText,

      options: [
        { label: "A", text: values.optionA },
        { label: "B", text: values.optionB },
        { label: "C", text: values.optionC },
        { label: "D", text: values.optionD },
      ],

      correctAnswer: values.correctAnswer as OptionLabel,

      explanation: values.explanation,

      subjectId: values.subjectId,
      chapterId: values.chapterId,
      topicId: values.topicId,

      status: values.status,

      examInfo: values.examCategory
        ? {
            category: values.examCategory as any,
            examName: values.examName,
            year: values.examYear,
          }
        : undefined,

      tags: values.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
        <FormField
          control={form.control}
          name="questionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(["A", "B", "C", "D"] as OptionLabel[]).map((label) => (
          <FormField
            key={label}
            control={form.control}
            name={`option${label}` as keyof FormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option {label}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation</FormLabel>
              <Textarea rows={3} {...field} />
            </FormItem>
          )}
        />

        {/* Replace Inputs with Selects using your APIs */}
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chapterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topicId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Input placeholder="constitution, parliament" {...field} />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Question"}
        </Button>
      </form>
    </Form>
  )
}
