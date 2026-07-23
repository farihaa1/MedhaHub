"use client"

import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

import QuestionBankActions from "./QuestionBankActions"

interface QuestionBankTableProps {
  data: IQuestionBank[]

  loading?: boolean

  onView?: (bank: IQuestionBank) => void

  onEdit?: (bank: IQuestionBank) => void

  onDelete?: (bank: IQuestionBank) => void

  onManageQuestions?: (bank: IQuestionBank) => void
}

export default function QuestionBankTable({
  data,
  loading = false,

  onView,
  onEdit,
  onDelete,
  onManageQuestions,
}: QuestionBankTableProps) {
  if (loading) {
    return <div className="rounded-lg border p-10 text-center">Loading...</div>
  }

  if (!data.length) {
    return (
      <div className="rounded-lg border p-10 text-center">
        No Question Banks Found
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>

            <TableHead>Category</TableHead>

            <TableHead>Year</TableHead>

            <TableHead>Paper</TableHead>

            <TableHead>Questions</TableHead>

            <TableHead>Visibility</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Premium</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((bank) => (
            <TableRow key={bank._id}>
              <TableCell className="font-medium">{bank.title}</TableCell>

              <TableCell>{bank.category}</TableCell>

              <TableCell>{bank.year ?? "-"}</TableCell>

              <TableCell>{bank.paper ?? "-"}</TableCell>

              <TableCell>
                <Badge variant="secondary">{bank.totalQuestions}</Badge>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    bank.visibility === "PUBLIC" ? "default" : "secondary"
                  }
                >
                  {bank.visibility}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge variant={bank.isPublished ? "default" : "destructive"}>
                  {bank.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge variant={bank.isPremium ? "destructive" : "outline"}>
                  {bank.isPremium ? "Premium" : "Free"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <QuestionBankActions
                  bank={bank}

                  onView={onView}

                  onEdit={onEdit}

                  onDelete={onDelete}

                  onManageQuestions={onManageQuestions}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
