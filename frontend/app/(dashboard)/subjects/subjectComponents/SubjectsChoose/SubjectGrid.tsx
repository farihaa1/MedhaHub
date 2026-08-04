"use client"
import { ISubject } from "../../subjects.type"
// import { subjects } from "@/app/data/subjects"
import SubjectCard from "./SubjectCard"
import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

export default function SubjectGrid() {
  const { data, isLoading, isError, error } = useGetSubjectsQuery()

  console.log("data", data)

  if (isLoading) return <p>Loading...from subjects</p>

  if (isError) {
    console.log(error)
    return <p>Something went wrong.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data?.data?.map((subject:ISubject) => (
        <SubjectCard key={subject._id} subject={subject} />
      ))}
    </div>
  )
}
