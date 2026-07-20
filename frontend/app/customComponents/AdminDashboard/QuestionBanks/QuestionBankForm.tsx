"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox"

import { useCreateQuestionBankMutation } from "@/app/redux/api/questionBankApi"
import { IQuestionBankForm } from "@/app/redux/types/questionBank.types"


type QuestionBankCategory =
  | "BCS"
  | "PRIMARY"
  | "NTRCA"
  | "BANK"
  | "UNIVERSITY"
  | "CUSTOM"

type QuestionBankPaper =
  | "PRELIMINARY"
  | "WRITTEN"
  | "VIVA"

type QuestionBankVisibility =
  | "PUBLIC"
  | "PRIVATE"


export default function QuestionBankForm() {
  const router = useRouter()

  const [createQuestionBank, { isLoading }] = useCreateQuestionBankMutation()

  const { register, handleSubmit, setValue, watch } =
    useForm<IQuestionBankForm>({
      defaultValues: {
        category: "BCS",
        paper: "PRELIMINARY",
        visibility: "PUBLIC",
        isPublished: true,
        isPremium: false,
      },
    })

  const onSubmit = async (values: IQuestionBankForm) => {
    try {
      const res = await createQuestionBank(values).unwrap()

      console.log(res)

      router.push("/question-bank")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Title */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>

        <Input
          placeholder="BCS 2025 Preliminary"
          {...register("title", {
            required: true,
          })}
        />
      </div>

      {/* Category */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>

        <Select
          defaultValue="BCS"
          onValueChange={(value) =>
            setValue("category", value as QuestionBankCategory)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="BCS">BCS</SelectItem>

            <SelectItem value="PRIMARY">Primary</SelectItem>

            <SelectItem value="NTRCA">NTRCA</SelectItem>

            <SelectItem value="BANK">Bank</SelectItem>

            <SelectItem value="UNIVERSITY">University</SelectItem>

            <SelectItem value="CUSTOM">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Year */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Year</label>

        <Input
          type="number"
          placeholder="2025"
          {...register("year", {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* Paper */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Paper</label>

        <Select
          defaultValue="PRELIMINARY"
          onValueChange={(value) =>
            setValue("paper", value as QuestionBankPaper)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select paper" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="PRELIMINARY">Preliminary</SelectItem>

            <SelectItem value="WRITTEN">Written</SelectItem>

            <SelectItem value="VIVA">Viva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Organization */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Organization</label>

        <Input
          placeholder="Bangladesh Public Service Commission"
          {...register("organization")}
        />
      </div>

      {/* Description */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>

        <Textarea
          placeholder="Question bank description..."
          rows={5}
          {...register("description")}
        />
      </div>

      {/* Visibility */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Visibility</label>

        <Select
          defaultValue="PUBLIC"
          onValueChange={(value) =>
            setValue("visibility", value as QuestionBankVisibility)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="PUBLIC">Public</SelectItem>

            <SelectItem value="PRIVATE">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Premium */}

      <div className="flex items-center gap-3">
        <Checkbox
          checked={watch("isPremium")}
          onCheckedChange={(checked) => setValue("isPremium", Boolean(checked))}
        />

        <span>Premium Question Bank</span>
      </div>

      {/* Published */}

      <div className="flex items-center gap-3">
        <Checkbox
          checked={watch("isPublished")}
          onCheckedChange={(checked) =>
            setValue("isPublished", Boolean(checked))
          }
        />

        <span>Publish immediately</span>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Question Bank"}
      </Button>
    </form>
  )
}
