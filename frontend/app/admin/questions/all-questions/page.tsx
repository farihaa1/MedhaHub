// "use client"

// import { useMemo, useState } from "react"

// import PageHeader from "@/app/customComponents/shared/PageHeader"
// import QuestionFilters from "@/app/customComponents/AdminDashboard/Questions/QuestionFilters"
// import PaginationBar from "@/app/customComponents/AdminDashboard/Questions/pagination"
// import BulkActionsDropdown from "@/app/customComponents/AdminDashboard/Questions/BulkActionsDropdown"
// import CreateQuestionDialog from "@/app/customComponents/AdminDashboard/Questions/CreateQuestionDialog"
// import QuestionCard from "@/app/customComponents/PublicComponents/Subjects/QuestionCard"
// import QuestionCardSkeleton from "@/app/customComponents/PublicComponents/Subjects/QuestionCardSkeleton"
// import {
//   QuestionDifficulty,
//   QuestionStatus,
//   QuestionType,
//   QuestionSourceType,
// } from "@/app/redux/api/questionsApi"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"

// import { RefreshCcw } from "lucide-react"

// import { useGetQuestionsQuery } from "@/app/redux/api/questionsApi"
// import BulkAddToQuestionBankDialog from "./components/BulkAddToQuestionBankDialog"

// export default function QuestionsPage() {
//    const [page, setPage] = useState(1)
//    const [limit, setLimit] = useState(10)

//    const [search, setSearch] = useState("")

//    const [subjectId, setSubjectId] = useState("")
//    const [chapterId, setChapterId] = useState("")
//    const [topicId, setTopicId] = useState("")

//    const [difficulty, setDifficulty] = useState("")
//    const [status, setStatus] = useState("")
//    const [type, setType] = useState("")
//    const [source, setSource] = useState("")

//    const [sort, setSort] = useState("-createdAt")

//    const { data, isLoading, isFetching } = useGetQuestionsQuery({
//      page,
//      limit,
//      searchTerm: search || undefined,

//      subjectId: subjectId || undefined,
//      chapterId: chapterId || undefined,
//      topicId: topicId || undefined,

//      difficulty: (difficulty || undefined) as QuestionDifficulty | undefined,

//      status: (status || undefined) as QuestionStatus | undefined,

//      type: (type || undefined) as QuestionType | undefined,

//      source: (source || undefined) as QuestionSourceType | undefined,

//      sortBy: "createdAt",
//      sortOrder: sort === "-createdAt" ? "desc" : "asc",
//    })

 
//   const [selectedIds, setSelectedIds] = useState<string[]>([])
//   const [bulkDialogOpen, setBulkDialogOpen] = useState(false)

//   const [searchTerm, setSearchTerm] = useState("")

//   const { data, isLoading, refetch } = useGetQuestionsQuery({
//     page,
//     limit: 20,

//     searchTerm,

//     subjectId: subjectId || undefined,
//     chapterId: chapterId || undefined,
//     topicId: topicId || undefined,

//     difficulty,
//     status,
//     type,
//     source,

//     sortBy: "createdAt",
//     sortOrder: "desc",
//   })

//   const questions = data?.data.data ?? []

//   const allIds = useMemo(() => questions.map((q) => q._id), [questions])

//   const allSelected =
//     questions.length > 0 && questions.every((q) => selectedIds.includes(q._id))

//   const toggleAll = () => {
//     if (allSelected) {
//       setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)))
//     } else {
//       setSelectedIds((prev) => [...new Set([...prev, ...allIds])])
//     }
//   }

//   const toggleQuestion = (id: string) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Question Management"
//         description={`${data?.data.meta.total ?? 0} Questions`}
//       />

//       <QuestionFilters
//         subjectId={subjectId}
//         setSubjectId={setSubjectId}

//         chapterId={chapterId}
//         setChapterId={setChapterId}

//         topicId={topicId}
//         setTopicId={setTopicId}

//         difficulty={difficulty}
//         setDifficulty={setDifficulty}

//         status={status}
//         setStatus={setStatus}

//         type={type}
//         setType={setType}

//         source={source}
//         setSource={setSource}

//         sort={sort}
//         setSort={setSort}

//         setPage={setPage}
//       />

//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <Checkbox checked={allSelected} onCheckedChange={toggleAll} />

//           <span className="text-sm">{selectedIds.length} selected</span>

//           <BulkActionsDropdown
//             selectedIds={selectedIds}
//             onExport={() => {}}
//             onArchive={() => {}}
//             onDelete={() => {}}
//             onPublish={() => {}}
//             onDuplicate={() => {}}
//           />

//           <Button
//             variant="outline"
//             disabled={!selectedIds.length}
//             onClick={() => setBulkDialogOpen(true)}
//           >
//             Add To Question Bank
//           </Button>
//         </div>

//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => {
//               setSelectedIds([])
//               refetch()
//             }}
//           >
//             <RefreshCcw className="mr-2 h-4 w-4" />
//             Refresh
//           </Button>

//           <CreateQuestionDialog />
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="space-y-6">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <QuestionCardSkeleton key={i} />
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {questions.length === 0 && (
//             <div className="rounded-lg border p-12 text-center">
//               <h3 className="text-lg font-semibold">No Questions Found</h3>

//               <p className="mt-2 text-muted-foreground">
//                 Try changing the filters or create a new question.
//               </p>
//             </div>
//           )}

//           {questions.map((question) => (
//             <div key={question._id} className="flex items-start gap-4">
//               <Checkbox
//                 checked={selectedIds.includes(question._id)}
//                 onCheckedChange={() => toggleQuestion(question._id)}
//               />

//               <div className="flex-1">
//                 <QuestionCard question={question} />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <PaginationBar
//         currentPage={data?.data.meta.page ?? 1}
//         totalPage={data?.data.meta.totalPage ?? 1}
//         onPageChange={setPage}
//       />

//       <BulkAddToQuestionBankDialog
//         open={bulkDialogOpen}
//         onOpenChange={setBulkDialogOpen}
//         questionIds={selectedIds}
//       />
//     </div>
//   )
// }
