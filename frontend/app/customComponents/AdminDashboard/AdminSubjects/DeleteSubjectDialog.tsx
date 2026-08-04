"use client"

import { useState } from "react"

import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"

import { useDeleteSubjectMutation } from "@/app/redux/api/subjectsApi"

interface Props {
  subject: ISubject
  children?: React.ReactNode
}

export default function DeleteSubjectDialog({ subject, children }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteSubject, { isLoading }] = useDeleteSubjectMutation()

  async function handleDelete() {
    try {
      await deleteSubject(subject._id).unwrap()

      toast.success("Subject deleted")

      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>

          <AlertDialogDescription>
            Delete <strong>{subject.title}</strong>?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
