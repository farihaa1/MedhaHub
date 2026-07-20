"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"


import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"
import { useGetQuestionBankQuery, useUpdateQuestionBankMutation } from "@/app/redux/api/questionBankApi"

interface Props {
  id: string
}
interface QuestionBankFormValues {
  title: string
  category: string
  year?: number
  organization?: string
  description?: string
  visibility: string
  isPremium: boolean
  isPublished: boolean
}
export default function QuestionBankEditForm({ id }: Props) {
  const router = useRouter()

  const { data, isLoading } = useGetQuestionBankQuery(id)

  const [updateQuestionBank, { isLoading: updateLoading }] =
    useUpdateQuestionBankMutation()

 const { register, handleSubmit, reset } = useForm<QuestionBankFormValues>()

  useEffect(() => {
    if (data?.data) {
      reset(data.data)
    }
  }, [data, reset])

  const onSubmit = async (values: QuestionBankFormValues) => {
    await updateQuestionBank({
      id,

      data: values,
    }).unwrap()

    router.push(`/question-bank/${id}`)
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}

      className="max-w-2xl space-y-5"
    >
      <Input
        placeholder="Title"

        {...register("title")}
      />

      <Input
        placeholder="Category"

        {...register("category")}
      />

      <Input
        type="number"

        placeholder="Year"

        {...register("year", {
          valueAsNumber: true,
        })}
      />

      <Input
        placeholder="Organization"

        {...register("organization")}
      />

      <Textarea
        placeholder="Description"

        {...register("description")}
      />

      <Input
        placeholder="Visibility"

        {...register("visibility")}
      />

      <label className="flex gap-2">
        <input
          type="checkbox"

          {...register("isPremium")}
        />
        Premium
      </label>

      <label className="flex gap-2">
        <input
          type="checkbox"

          {...register("isPublished")}
        />
        Published
      </label>

      <Button disabled={updateLoading}>
        {updateLoading ? "Updating..." : "Save Changes"}
      </Button>
    </form>
  )
}
