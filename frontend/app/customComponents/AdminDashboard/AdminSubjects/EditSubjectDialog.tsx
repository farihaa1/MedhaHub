"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import SubjectForm, { SubjectFormValues } from "./SubjectForm"

import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"
import { useUpdateSubjectMutation } from "@/app/redux/api/subjectsApi"

interface Props {
  subject: ISubject
  children?: React.ReactNode
}

export default function EditSubjectDialog({ subject, children }: Props) {
  const [open, setOpen] = useState(false)

  const [updateSubject, { isLoading }] = useUpdateSubjectMutation()

  async function handleSubmit(values: SubjectFormValues) {
    try {
      await updateSubject({
        id: subject._id,
        data: values,
      }).unwrap()

      toast.success("Subject updated")

      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>

        <SubjectForm
          defaultValues={{
            title: subject.title,
            slug: subject.slug,
            url: subject.url,
          }}
          onSubmit={handleSubmit}
          loading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
