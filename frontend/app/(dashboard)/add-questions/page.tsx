import QuestionCreateForm from "@/app/customComponents/Dashboard/AddQuestion/QuestionCreateForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"


export default function AddQuestion() {
  return (
    <section className="space-y-6 rounded-3xl bg-black p-8 text-white">
      <Card className="mx-auto max-w-6xl rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create Question</CardTitle>

          <CardDescription>
            Add a new MCQ question to the question bank.
          </CardDescription>
        </CardHeader>

        <CardContent>
          
      <QuestionCreateForm />
        </CardContent>
      </Card>
    </section>
  )
}
