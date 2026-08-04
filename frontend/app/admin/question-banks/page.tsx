"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/app/customComponents/shared/PageHeader"
import QuestionBankToolbar from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankToolbar"
import QuestionBankTable from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankTable"
import ViewQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/ViewQuestionBankDialog"

import {
  IQuestionBank,
  TQuestionBankCategory,
  TQuestionBankPaper,
  TQuestionBankVisibility,
} from "@/app/redux/types/questionBank.types"
import CreateQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/CreateQuestionBankDialog"
import EditQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/EditQuestionBankDialog"
import DeleteQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/DeleteQuestionBankDialog"
import { Loader2 } from "lucide-react"
import { useGetQuestionBanksQuery } from "@/app/redux/api/questionBanksApi"

export default function QuestionBankPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<TQuestionBankCategory | "ALL">("ALL")
  const [paper, setPaper] = useState<TQuestionBankPaper | "ALL">("ALL")
  const [visibility, setVisibility] = useState<TQuestionBankVisibility | "ALL">(
    "ALL"
  )
  const [openCreate, setOpenCreate] = useState(false)
  const [selectedBank, setSelectedBank] = useState<IQuestionBank | null>(null)
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
 
  const [page, setPage] = useState(1)
  const limit = 10

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategoryChange = (value: TQuestionBankCategory | "ALL") => {
    setCategory(value)
    setPage(1)
  }

  const handlePaperChange = (value: TQuestionBankPaper | "ALL") => {
    setPaper(value)
    setPage(1)
  }

  const handleVisibilityChange = (value: TQuestionBankVisibility | "ALL") => {
    setVisibility(value)
    setPage(1)
  }
  const handleView = (bank: IQuestionBank) => {
    setSelectedBank(bank)
    setOpenView(true)
  }

  const handleEdit = (bank: IQuestionBank) => {
    setSelectedBank(bank)
    setOpenEdit(true)
  }

  const handleDelete = (bank: IQuestionBank) => {
    setSelectedBank(bank)
    setOpenDelete(true)
  }


  const getPages = () => {
    const pages: number[] = []

    let start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + 4)

    // keep 5 buttons visible
    start = Math.max(1, end - 4)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const { data, isLoading, isFetching, error } = useGetQuestionBanksQuery({
    page,
    limit,
    ...(search && { searchTerm: search }),
    ...(category !== "ALL" && { category }),
    ...(paper !== "ALL" && { paper }),
    ...(visibility !== "ALL" && { visibility }),
  })
  console.log(category)

  const questionBanks: IQuestionBank[] = data?.data.data ?? []

  const meta = data?.data.meta
  const currentPage = meta?.page ?? 1
  const totalPages = meta?.totalPage ?? 1

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading Question Banks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Failed to load Question Banks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:p-6">
      <PageHeader
        title="Question Banks"
        description="Manage all Question Banks"
      />

      <div className="bg-background p-6">
        <div className="text-sm text-muted-foreground">
          {isFetching && "Refreshing..."}
        </div>

        <div className="mb-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span>
            <strong>Total:</strong> {meta?.total ?? 0}
          </span>

          <span>
            <strong>Page:</strong> {meta?.page ?? 1}
          </span>

          <span>
            <strong>Per Page:</strong> {meta?.limit ?? 10}
          </span>

          <span>
            <strong>Total Pages:</strong> {meta?.totalPage ?? 1}
          </span>
        </div>

        <QuestionBankToolbar
          search={search}
          onSearchChange={handleSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          paper={paper}
          onPaperChange={handlePaperChange}
          visibility={visibility}
          onVisibilityChange={handleVisibilityChange}
          onCreate={() => setOpenCreate(true)}
        />

        {questionBanks.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed py-10 text-center text-muted-foreground">
            No Question Banks Found
          </div>
        ) : (
          <div className="relative min-h-150">
            <QuestionBankTable
              data={questionBanks}
              loading={isFetching}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageQuestions={(bank) =>
                router.push(`/admin/question-banks/manage/${bank._id}`)
              }
            />

            {isFetching && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        )}
        {meta && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </Button>

              {getPages().map((pageNumber) => (
                <Button
                  key={pageNumber}
                  size="sm"
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {/* Uncomment after creating */}

        <CreateQuestionBankDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
        />

        <ViewQuestionBankDialog
          open={openView}
          onOpenChange={setOpenView}
          bank={selectedBank}
        />

        {/* Next */}

        <EditQuestionBankDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          bank={selectedBank}
        />

        <DeleteQuestionBankDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          bank={selectedBank}
        />
      </div>
    </div>
  )
}
