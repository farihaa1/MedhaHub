import Image from "next/image"

import RankBadge from "./RankBadge"
import PremiumBadge from "./PremiumBadge"

interface Props {
  rank: number
  name: string
  avatar: string
  points: string
  premium: boolean
}

export default function LeaderboardItem({
  rank,
  name,
  avatar,
  points,
  premium,
}: Props) {
  return (
    <div className="group flex items-center justify-between rounded-xl p-2 transition hover:bg-accent">
      <div className="flex items-center gap-3">
        <RankBadge rank={rank} />

        <Image
          src={avatar}
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
        />

        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{name}</p>

            {premium && <PremiumBadge />}
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-muted-foreground">{points}%</p>
    </div>
  )
}
