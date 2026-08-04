// "use client"

// import { useState } from "react"
// import { toast } from "sonner"
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"

// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"

// import { IQuestionBank } from "@/app/redux/types/questionBank.types"

// import {
//   useBulkAddQuestionsMutation,
//   useGetQuestionsByBankQuery,
// } from "@/app/redux/api/questionBankItemApi"

// import QuestionSelectorTable from "./QuestionSelectorTable"
// import SelectedQuestionsTable from "./SelectedQuestionsTable"


// interface Props {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   bank: IQuestionBank | null
// }

// export default function ManageQuestionBankQuestions({
//   open,
//   onOpenChange,
//   bank,
// }: Props) {
//   const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])

//   const { data, isLoading, refetch } = useGetQuestionsByBankQuery(
//     {
//       questionBankId: bank?._id ?? "",
//       page: 1,
//       limit: 20,
//     },
//     {
//       skip: !bank,
//     }
//   )

//   const [bulkAddQuestions, { isLoading: adding }] =
//     useBulkAddQuestionsMutation()

//   const handleAdd = async () => {
//     if (!bank) return

//     if (selectedQuestionIds.length === 0) {
//       toast.error("Please select at least one question.")
//       return
//     }

//     try {
//       await bulkAddQuestions({
//         questionBankId: bank._id,
//         data: {
//           questionIds: selectedQuestionIds,
//         },
//       }).unwrap()

//       toast.success("Questions added successfully.")

//       setSelectedQuestionIds([])

//       refetch()
//     } catch (error) {
//       const err = error as FetchBaseQueryError & {
//         data?: {
//           message?: string
//         }
//       }

//       toast.error(err.data?.message ?? "Failed to add questions.")
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="flex h-[90vh] max-w-7xl flex-col overflow-hidden">
//         <DialogHeader>
//           <DialogTitle>Manage Question Bank</DialogTitle>
//           <DialogDescription>{bank?.title}</DialogDescription>
//         </DialogHeader>

//         <Separator />

//         <div className="flex items-center justify-between py-2">
//           <p className="text-sm text-muted-foreground">
//             Selected:{" "}
//             <span className="font-semibold">{selectedQuestionIds.length}</span>{" "}
//             question(s)
//           </p>

//           <Button
//             onClick={handleAdd}
//             disabled={adding || selectedQuestionIds.length === 0}
//           >
//             Add Selected
//           </Button>
//         </div>

//         <div className="flex-1 space-y-6 overflow-hidden">
//           <section className="flex h-1/2 flex-col overflow-hidden rounded-lg border">
//             <div className="border-b bg-muted/50 px-4 py-3 font-semibold">
//               Available Questions
//             </div>

//             <div className="flex-1 overflow-auto">
//               <QuestionSelectorTable onSelect={setSelectedQuestionIds} />
//             </div>
//           </section>

//           <section className="flex h-1/2 flex-col overflow-hidden rounded-lg border">
//             <div className="border-b bg-muted/50 px-4 py-3 font-semibold">
//               Questions in Bank
//             </div>

//             <div className="flex-1 overflow-auto">
//               <SelectedQuestionsTable
//                 loading={isLoading}
//                 data={data?.data.data ?? []}
//                 bankId={bank?._id ?? ""}
//                 onRefresh={refetch}
//               />
//             </div>
//           </section>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
