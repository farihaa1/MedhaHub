"use client"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import SubjectForm, { SubjectFormValues } from "./SubjectForm"

import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"
import { useUpdateSubjectMutation } from "@/app/redux/api/subjectsApi"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: ISubject
}

export default function EditSubjectDialog({
  open,
  onOpenChange,
  subject,
}: Props) {
  const [updateSubject, { isLoading }] = useUpdateSubjectMutation()

  const handleSubmit = async (values: SubjectFormValues) => {
    try {
      await updateSubject({
        id: subject._id,
        data: {
          title: values.title,
          slug: values.slug as ISubject["slug"],
          url: values.url,
        },
      }).unwrap()

      toast.success("Subject updated successfully.")
      onOpenChange(false)
    } catch (error: unknown) {
      //   toast.error(error?.data?.message ?? "Failed to update subject.")
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>Update subject information.</DialogDescription>
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
