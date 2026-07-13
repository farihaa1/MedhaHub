// "use client"

// interface Props {
//   total: number
//   current: number
//   onChange: (index: number) => void
// }

// export default function QuestionNavigator({ total, current, onChange }: Props) {
//   return (
//     <div className="grid grid-cols-5 gap-2">
//       {Array.from({ length: total }).map((_, index) => (
//         <button
//           key={index}
//           onClick={() => onChange(index)}
//           className={`rounded border p-2 ${
//             current === index ? "bg-blue-600 text-white" : ""
//           }`}
//         >
//           {index + 1}
//         </button>
//       ))}
//     </div>
//   )
// }
