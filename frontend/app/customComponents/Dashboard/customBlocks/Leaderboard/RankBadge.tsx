import { Trophy, Medal, Award } from "lucide-react"

interface Props {
  rank: number
}

export default function RankBadge({ rank }: Props) {
  if (rank === 1)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500 text-white">
        <Trophy className="h-4 w-4" />
      </div>
    )

  if (rank === 2)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-400 text-white">
        <Medal className="h-4 w-4" />
      </div>
    )

  if (rank === 3)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
        <Award className="h-4 w-4" />
      </div>
    )

  return <div className="w-8 text-center font-semibold">{rank}</div>
}
