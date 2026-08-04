"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SubjectForm, { SubjectFormValues } from "./SubjectForm"
import { useCreateSubjectMutation } from "@/app/redux/api/subjectsApi"

export default function CreateSubjectDialog() {
  const [open, setOpen] = useState(false)

  const [createSubject, { isLoading }] = useCreateSubjectMutation()

  const handleSubmit = async (values: SubjectFormValues) => {
    try {
      await createSubject(values).unwrap()

      toast.success("Subject created successfully.")

      setOpen(false)
    } catch (error) {
    //   toast.error(error?.data?.message ?? "Failed to create subject.")
    console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Subject</DialogTitle>

          <DialogDescription>Add a new subject to MedhaHub.</DialogDescription>
        </DialogHeader>

        <SubjectForm onSubmit={handleSubmit} loading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
