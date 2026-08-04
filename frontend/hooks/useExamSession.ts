import { selectExamSession } from "@/app/redux/api/exam-engine.selector"
import { useSelector } from "react-redux"

export const useExamSession = () => {
  return useSelector(selectExamSession)
}
