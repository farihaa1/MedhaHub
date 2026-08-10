// "use client"

// import { ExamOptionLabel } from "@/app/redux/types/exam.type"
// import Image from "next/image"



// export default function ExamQuestion({
//   question,
//   selectedOption,
//   onSelect,
// }: ExamQuestionProps) {
//   const questionId = question.questionId

//   const options = question.options ?? []

//   return (
//     <article className="rounded-xl border bg-card p-5 shadow-sm">
//       {/* Question */}

//       <div className="flex gap-3">
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
//           {question.order}
//         </div>

//         <div className="min-w-0 flex-1">
//           <p className="text-base leading-7 font-semibold">
//             {question.questionText ?? "Question"}
//           </p>

//           {question.questionImage && (
//             <div className="relative mt-4 h-64 w-full">
//               <Image
//                 src={question.questionImage}
//                 alt="Question"
//                 fill
//                 sizes="(max-width: 768px) 100vw, 768px"
//                 className="rounded-lg object-contain"
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Options */}

//       <div className="mt-5 grid gap-3">
//         {options.map((option, index) => {
//           const label = option.label ?? optionLabels[index]

//           if (!label) return null

//           const selected = selectedOption === label

//           return (
//             <button
//               key={option._id ?? `${questionId}-${label}`}
//               type="button"
//               onClick={() => onSelect(questionId, label)}
//               className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
//                 selected
//                   ? "border-primary bg-primary/5"
//                   : "border-border hover:bg-muted"
//               }`}
//             >
//               <ExamOptionLabel label={label} selected={selected} />

//               <span className="flex-1 text-sm leading-6">{option.text}</span>
//             </button>
//           )
//         })}
//       </div>
//     </article>
//   )
// }
