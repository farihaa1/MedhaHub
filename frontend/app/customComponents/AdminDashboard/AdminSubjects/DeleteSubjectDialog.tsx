"use client"

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
} from "@/components/ui/alert-dialog"

import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"
import { useDeleteSubjectMutation } from "@/app/redux/api/subjectsApi"

interface DeleteSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: ISubject
}

export default function DeleteSubjectDialog({
  open,
  onOpenChange,
  subject,
}: DeleteSubjectDialogProps) {
  const [deleteSubject, { isLoading }] = useDeleteSubjectMutation()

  const handleDelete = async () => {
    try {
      await deleteSubject(subject._id).unwrap()

      toast.success("Subject deleted successfully.")

      onOpenChange(false)
    } catch (error: unknown) {
        console.log(error)
    //   toast.error(error?.data?.message ?? "Failed to delete subject.")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete <strong>{subject.title}</strong>?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
