export const colorPalette = [
  {
    name: "blue",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    progress: "bg-blue-400",
  },
  {
    name: "sky",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    progress: "bg-sky-400",
  },
  {
    name: "cyan",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    progress: "bg-cyan-400",
  },
  {
    name: "teal",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    progress: "bg-teal-400",
  },
  {
    name: "emerald",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    progress: "bg-emerald-400",
  },
  {
    name: "green",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    progress: "bg-green-400",
  },
  {
    name: "lime",
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    progress: "bg-lime-400",
  },
  {
    name: "yellow",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    progress: "bg-yellow-400",
  },
  {
    name: "amber",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    progress: "bg-amber-400",
  },
  {
    name: "orange",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    progress: "bg-orange-400",
  },
  {
    name: "red",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    progress: "bg-red-400",
  },
  {
    name: "rose",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    progress: "bg-rose-400",
  },
  {
    name: "pink",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    progress: "bg-pink-400",
  },
  {
    name: "fuchsia",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
    progress: "bg-fuchsia-400",
  },
  {
    name: "purple",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    progress: "bg-purple-400",
  },
  {
    name: "violet",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    progress: "bg-violet-400",
  },
  {
    name: "indigo",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    progress: "bg-indigo-400",
  },
  {
    name: "slate",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    progress: "bg-slate-400",
  },
]
function hashString(str: string) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000
  }

  return hash
}

export function getSubjectColorBySlug(slug: string) {
  const index = hashString(slug)
  return colorPalette[index % colorPalette.length]
}
