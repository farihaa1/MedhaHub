// "use client"

// import { useEffect, useState } from "react"

// interface Props {
//   endTime: string
// }

// export default function ExamTimer({ endTime }: Props) {
//   const [timeLeft, setTimeLeft] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const diff = new Date(endTime).getTime() - Date.now()

//       setTimeLeft(Math.max(0, Math.floor(diff / 1000)))
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [endTime])

//   const minutes = Math.floor(timeLeft / 60)
//   const seconds = timeLeft % 60

//   return (
//     <div className="rounded bg-red-100 px-4 py-2 font-bold">
//       {minutes}:{seconds.toString().padStart(2, "0")}
//     </div>
//   )
// }
