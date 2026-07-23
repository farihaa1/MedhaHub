"use client"

import { useState } from "react"

import PageHeader from "@/app/customComponents/shared/PageHeader"
import QuestionBankToolbar from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankToolbar"
import QuestionBankTable from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankTable"

import ViewQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/ViewQuestionBankDialog"

// later
// import EditQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/EditQuestionBankDialog"
// import DeleteQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/DeleteQuestionBankDialog"
// import ManageQuestionBankQuestions from "@/app/customComponents/AdminDashboard/QuestionBanks/ManageQuestionBankQuestions"
import { useGetQuestionBanksQuery } from "@/app/redux/api/questionBankApi"

import {
  IQuestionBank,
  TQuestionBankCategory,
  TQuestionBankPaper,
  TQuestionBankVisibility,
} from "@/app/redux/types/questionBank.types"
import CreateQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/CreateQuestionBankDialog"
import EditQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/EditQuestionBankDialog"
import DeleteQuestionBankDialog from "@/app/customComponents/AdminDashboard/QuestionBanks/DeleteQuestionBankDialog"

export default function QuestionBankPage() {
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

  const [openManageQuestions, setOpenManageQuestions] = useState(false)
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

  const handleManageQuestions = (bank: IQuestionBank) => {
    setSelectedBank(bank)
    setOpenManageQuestions(true)
  }

  const { data, isLoading, isFetching, error } = useGetQuestionBanksQuery({
    page: 1,
    limit: 10,
    ...(search && { searchTerm: search }),
    ...(category !== "ALL" && { category }),
    ...(paper !== "ALL" && { paper }),
    ...(visibility !== "ALL" && { visibility }),
  })

  const questionBanks: IQuestionBank[] = data?.data.data ?? []

  const meta = data?.data.meta

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
    <div className="space-y-6 p-6">
      <PageHeader
        title="Question Banks"
        description="Manage all Question Banks"
      />

      <div className="rounded-lg border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Question Banks</h2>

            <p className="text-sm text-muted-foreground">
              Manage all question banks.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {isFetching && "Refreshing..."}
          </div>
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
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          paper={paper}
          onPaperChange={setPaper}
          visibility={visibility}
          onVisibilityChange={setVisibility}
          onCreate={() => setOpenCreate(true)}
        />

        {questionBanks.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed py-10 text-center text-muted-foreground">
            No Question Banks Found
          </div>
        ) : (
          <QuestionBankTable
            data={questionBanks}
            loading={isFetching}

            onView={handleView}

            onEdit={handleEdit}

            onDelete={handleDelete}

            onManageQuestions={handleManageQuestions}
          />
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

        {/* <ManageQuestionBankQuestions
          open={openManageQuestions}
          onOpenChange={setOpenManageQuestions}
          bank={selectedBank}
        /> */}
      </div>
    </div>
  )
}
