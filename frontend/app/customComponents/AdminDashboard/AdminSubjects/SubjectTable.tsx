"use client"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { columns } from "./columns"
import { DataTable } from "../data-table/DataTable"

export default function SubjectTable() {
  const { data, isLoading } = useGetSubjectsQuery()

  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
    />
  )
}
