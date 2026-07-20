"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

import {
  IQuestion,
  QuestionStatus,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
} from "@/app/redux/api/questionsApi"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"
import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import QuestionForm from "./QuestionForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AllQuestions() {
  /* ---------------- Filters ---------------- */

  const [page, setPage] = useState(1)

  const [limit] = useState(20)

  const [searchTerm, setSearchTerm] = useState("")

  const [subjectId, setSubjectId] = useState("")

  const [chapterId, setChapterId] = useState("")

  const [topicId, setTopicId] = useState("")

  const [status, setStatus] = useState<QuestionStatus | "">("")

  /* ---------------- Dialog States ---------------- */

  const [createOpen, setCreateOpen] = useState(false)

  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null)

  const [previewQuestion, setPreviewQuestion] = useState<IQuestion | null>(null)

  const [deleteQuestion, setDeleteQuestion] = useState<IQuestion | null>(null)

  /* ---------------- Query Params ---------------- */

  const query = useMemo(
    () => ({
      page,
      limit,
      searchTerm: searchTerm || undefined,
      subjectId: subjectId || undefined,
      chapterId: chapterId || undefined,
      topicId: topicId || undefined,
      status: status || undefined,
    }),
    [page, limit, searchTerm, subjectId, chapterId, topicId, status]
  )

  /* ---------------- Questions ---------------- */

  const { data, isLoading, isFetching, error } = useGetQuestionsQuery(query)

  const questions = data?.data ?? []

  /* ---------------- Dropdown Data ---------------- */

  const { data: subjectResponse } = useGetSubjectsQuery()

  const { data: chapterResponse } = useGetChaptersBySubjectQuery(subjectId, {
    skip: !subjectId,
  })

  const { data: topicResponse } = useGetTopicsByChapterQuery(chapterId, {
    skip: !chapterId,
  })

  const subjects = subjectResponse?.data ?? []

  const chapters = chapterResponse?.data ?? []

  const topics = topicResponse?.data ?? []

  /* ---------------- Mutations ---------------- */

  const [createQuestion, { isLoading: creating }] = useCreateQuestionMutation()

  const [updateQuestion, { isLoading: updating }] = useUpdateQuestionMutation()

  const [deleteQuestionMutation] = useDeleteQuestionMutation()

  /* ---------------- Lookups ---------------- */

  const subjectMap = useMemo(
    () => Object.fromEntries(subjects.map((item) => [item._id, item.name])),
    [subjects]
  )

  const chapterMap = useMemo(
    () => Object.fromEntries(chapters.map((item) => [item._id, item.title])),
    [chapters]
  )

  const topicMap = useMemo(
    () => Object.fromEntries(topics.map((item) => [item._id, item.title])),
    [topics]
  )

  /* ---------------- CRUD ---------------- */

  const handleCreate = async (data: Partial<IQuestion>) => {
    try {
      await createQuestion(data).unwrap()

      toast.success("Question created")

      setCreateOpen(false)
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create question")
    }
  }

  const handleUpdate = async (data: Partial<IQuestion>) => {
    if (!editingQuestion) return

    try {
      await updateQuestion({
        id: editingQuestion._id,
        data,
      }).unwrap()

      toast.success("Question updated")

      setEditingQuestion(null)
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update question")
    }
  }

  const handleDelete = async () => {
    if (!deleteQuestion) return

    try {
      await deleteQuestionMutation(deleteQuestion._id).unwrap()

      toast.success("Question deleted")

      setDeleteQuestion(null)
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete question")
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSubjectId("")
    setChapterId("")
    setTopicId("")
    setStatus("")
    setPage(1)
  }

 return (
   <div className="space-y-6">
     {/* ================= Header ================= */}

     <div className="flex items-center justify-between">
       <div>
         <h1 className="text-3xl font-bold">Questions</h1>

         <p className="text-muted-foreground">
           Total Questions: {questions.length}
         </p>
       </div>

       <Button onClick={() => setCreateOpen(true)}>+ Add Question</Button>
     </div>

     {/* ================= Filters ================= */}

     <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
       <Input
         placeholder="Search question..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
       />

       {/* Subject */}

       <Select
         value={subjectId}
         onValueChange={(value) => {
           setSubjectId(value)
           setChapterId("")
           setTopicId("")
         }}
       >
         <SelectTrigger>
           <SelectValue placeholder="Subject" />
         </SelectTrigger>

         <SelectContent>
           {subjects.map((subject) => (
             <SelectItem key={subject._id} value={subject._id}>
               {/* {subject.name} */}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>

       {/* Chapter */}

       <Select
         value={chapterId}
         disabled={!subjectId}
         onValueChange={(value) => {
           setChapterId(value)
           setTopicId("")
         }}
       >
         <SelectTrigger>
           <SelectValue placeholder="Chapter" />
         </SelectTrigger>

         <SelectContent>
           {chapters.map((chapter) => (
             <SelectItem key={chapter._id} value={chapter._id}>
               {chapter.title}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>

       {/* Topic */}

       <Select value={topicId} disabled={!chapterId} onValueChange={setTopicId}>
         <SelectTrigger>
           <SelectValue placeholder="Topic" />
         </SelectTrigger>

         <SelectContent>
           {topics.map((topic) => (
             <SelectItem key={topic._id} value={topic._id}>
               {topic.title}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>

       {/* Status */}

       <Select
         value={status || "all"}
         onValueChange={(value) =>
           setStatus(value === "all" ? "" : (value as QuestionStatus))
         }
       >
         <SelectTrigger>
           <SelectValue />
         </SelectTrigger>

         <SelectContent>
           <SelectItem value="all">All Status</SelectItem>

           <SelectItem value={QuestionStatus.Draft}>Draft</SelectItem>

           <SelectItem value={QuestionStatus.Approved}>Approved</SelectItem>
         </SelectContent>
       </Select>
     </div>

     {/* Reset */}

     <div>
       <Button variant="outline" onClick={resetFilters}>
         Reset Filters
       </Button>
     </div>

     {/* ================= Table ================= */}

     <div className="rounded-md border">
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Question</TableHead>

             <TableHead>Subject</TableHead>

             <TableHead>Chapter</TableHead>

             <TableHead>Topic</TableHead>

             <TableHead>Status</TableHead>

             <TableHead className="text-right">Actions</TableHead>
           </TableRow>
         </TableHeader>

         <TableBody>
           {isLoading || isFetching ? (
             <TableRow>
               <TableCell colSpan={6} className="h-32 text-center">
                 Loading Questions...
               </TableCell>
             </TableRow>
           ) : error ? (
             <TableRow>
               <TableCell colSpan={6} className="h-32 text-center text-red-500">
                 Failed to load questions.
               </TableCell>
             </TableRow>
           ) : questions.length === 0 ? (
             <TableRow>
               <TableCell colSpan={6} className="h-32 text-center">
                 No Questions Found
               </TableCell>
             </TableRow>
           ) : (
             questions.map((question) => (
               <TableRow key={question._id}>
                 <TableCell className="max-w-lg">
                   <div className="line-clamp-2">{question.questionText}</div>
                 </TableCell>

                 <TableCell>{subjectMap[question.subjectId] ?? "-"}</TableCell>

                 <TableCell>{chapterMap[question.chapterId] ?? "-"}</TableCell>

                 <TableCell>{topicMap[question.topicId] ?? "-"}</TableCell>

                 <TableCell>{question.status}</TableCell>

                 <TableCell>
                   <div className="flex justify-end gap-2">
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => setPreviewQuestion(question)}
                     >
                       View
                     </Button>

                     <Button
                       size="sm"
                       onClick={() => setEditingQuestion(question)}
                     >
                       Edit
                     </Button>

                     <Button
                       size="sm"
                       variant="destructive"
                       onClick={() => setDeleteQuestion(question)}
                     >
                       Delete
                     </Button>
                   </div>
                 </TableCell>
               </TableRow>
             ))
           )}
         </TableBody>
       </Table>
     </div>

     {/* =========================
      Create Question
========================= */}

     <Dialog open={createOpen} onOpenChange={setCreateOpen}>
       <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
         <DialogHeader>
           <DialogTitle>Create Question</DialogTitle>
         </DialogHeader>

         <QuestionForm loading={creating} onSubmit={handleCreate} />
       </DialogContent>
     </Dialog>

     {/* =========================
      Edit Question
========================= */}

     <Dialog
       open={!!editingQuestion}
       onOpenChange={() => setEditingQuestion(null)}
     >
       <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
         <DialogHeader>
           <DialogTitle>Edit Question</DialogTitle>
         </DialogHeader>

         {editingQuestion && (
           <QuestionForm
             defaultValues={editingQuestion}
             loading={updating}
             onSubmit={handleUpdate}
           />
         )}
       </DialogContent>
     </Dialog>
   </div>
 )
}
