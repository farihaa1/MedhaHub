import { color } from "../type"

export const colorPalette: color[] = [
  {
    name: "blue",
    bg: "bg-blue-500/8",
    border: "border-blue-500/20",
    progress: "bg-blue-400",
  },
  {
    name: "sky",
    bg: "bg-sky-500/8",
    border: "border-sky-500/20",
    progress: "bg-sky-400",
  },
  {
    name: "cyan",
    bg: "bg-cyan-500/8",
    border: "border-cyan-500/20",
    progress: "bg-cyan-400",
  },
  {
    name: "teal",
    bg: "bg-teal-500/8",
    border: "border-teal-500/20",
    progress: "bg-teal-400",
  },
  {
    name: "emerald",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/20",
    progress: "bg-emerald-400",
  },
  {
    name: "green",
    bg: "bg-green-500/8",
    border: "border-green-500/20",
    progress: "bg-green-400",
  },
  {
    name: "lime",
    bg: "bg-lime-500/8",
    border: "border-lime-500/20",
    progress: "bg-lime-400",
  },
  {
    name: "yellow",
    bg: "bg-yellow-500/8",
    border: "border-yellow-500/20",
    progress: "bg-yellow-400",
  },
  {
    name: "amber",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
    progress: "bg-amber-400",
  },
  {
    name: "orange",
    bg: "bg-orange-500/8",
    border: "border-orange-500/20",
    progress: "bg-orange-400",
  },
  {
    name: "red",
    bg: "bg-red-500/8",
    border: "border-red-500/20",
    progress: "bg-red-400",
  },
  {
    name: "rose",
    bg: "bg-rose-500/8",
    border: "border-rose-500/20",
    progress: "bg-rose-400",
  },
  {
    name: "pink",
    bg: "bg-pink-500/8",
    border: "border-pink-500/20",
    progress: "bg-pink-400",
  },
  {
    name: "fuchsia",
    bg: "bg-fuchsia-500/8",
    border: "border-fuchsia-500/20",
    progress: "bg-fuchsia-400",
  },
  {
    name: "purple",
    bg: "bg-purple-500/8",
    border: "border-purple-500/20",
    progress: "bg-purple-400",
  },
  {
    name: "violet",
    bg: "bg-violet-500/8",
    border: "border-violet-500/20",
    progress: "bg-violet-400",
  },
  {
    name: "indigo",
    bg: "bg-indigo-500/8",
    border: "border-indigo-500/20",
    progress: "bg-indigo-400",
  },
  {
    name: "slate",
    bg: "bg-slate-500/8",
    border: "border-slate-500/20",
    progress: "bg-slate-400",
  },
]
function hashString(str: string) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 800000
  }

  return hash
}

export function getSubjectColorBySlug(slug: string) {
  const index = hashString(slug)
  return colorPalette[index % colorPalette.length]
}

export const themeMap: Record<
  color["name"],
  {
    text: string
    icon: string
    bg: string
    border: string
    hover: string
    ring: string
    button: string
  }
> = {
  blue: {
    text: "text-blue-300",
    icon: "text-blue-400",
    bg: "bg-blue-500/8",
    border: "border-blue-500/30",
    hover: "hover:border-blue-500/40",
    ring: "border-blue-500/30",
    button: "bg-blue-600 hover:bg-blue-500",
  },

  sky: {
    text: "text-sky-300",
    icon: "text-sky-400",
    bg: "bg-sky-500/8",
    border: "border-sky-500/30",
    hover: "hover:border-sky-500/40",
    ring: "border-sky-500/30",
    button: "bg-sky-600 hover:bg-sky-500",
  },

  cyan: {
    text: "text-cyan-300",
    icon: "text-cyan-400",
    bg: "bg-cyan-500/8",
    border: "border-cyan-500/30",
    hover: "hover:border-cyan-500/40",
    ring: "border-cyan-500/30",
    button: "bg-cyan-600 hover:bg-cyan-500",
  },

  teal: {
    text: "text-teal-300",
    icon: "text-teal-400",
    bg: "bg-teal-500/8",
    border: "border-teal-500/30",
    hover: "hover:border-teal-500/40",
    ring: "border-teal-500/30",
    button: "bg-teal-600 hover:bg-teal-500",
  },

  emerald: {
    text: "text-emerald-300",
    icon: "text-emerald-400",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/30",
    hover: "hover:border-emerald-500/40",
    ring: "border-emerald-500/30",
    button: "bg-emerald-600 hover:bg-emerald-500",
  },

  green: {
    text: "text-green-300",
    icon: "text-green-400",
    bg: "bg-green-500/8",
    border: "border-green-500/30",
    hover: "hover:border-green-500/40",
    ring: "border-green-500/30",
    button: "bg-green-600 hover:bg-green-500",
  },

  lime: {
    text: "text-lime-300",
    icon: "text-lime-400",
    bg: "bg-lime-500/8",
    border: "border-lime-500/30",
    hover: "hover:border-lime-500/40",
    ring: "border-lime-500/30",
    button: "bg-lime-600 hover:bg-lime-500",
  },

  yellow: {
    text: "text-yellow-300",
    icon: "text-yellow-400",
    bg: "bg-yellow-500/8",
    border: "border-yellow-500/30",
    hover: "hover:border-yellow-500/40",
    ring: "border-yellow-500/30",
    button: "bg-yellow-600 hover:bg-yellow-500 text-black",
  },

  amber: {
    text: "text-amber-300",
    icon: "text-amber-400",
    bg: "bg-amber-500/8",
    border: "border-amber-500/30",
    hover: "hover:border-amber-500/40",
    ring: "border-amber-500/30",
    button: "bg-amber-600 hover:bg-amber-500 text-black",
  },

  orange: {
    text: "text-orange-300",
    icon: "text-orange-400",
    bg: "bg-orange-500/8",
    border: "border-orange-500/30",
    hover: "hover:border-orange-500/40",
    ring: "border-orange-500/30",
    button: "bg-orange-600 hover:bg-orange-500",
  },

  red: {
    text: "text-red-300",
    icon: "text-red-400",
    bg: "bg-red-500/8",
    border: "border-red-500/30",
    hover: "hover:border-red-500/40",
    ring: "border-red-500/30",
    button: "bg-red-600 hover:bg-red-500",
  },

  rose: {
    text: "text-rose-300",
    icon: "text-rose-400",
    bg: "bg-rose-500/8",
    border: "border-rose-500/30",
    hover: "hover:border-rose-500/40",
    ring: "border-rose-500/30",
    button: "bg-rose-600 hover:bg-rose-500",
  },

  pink: {
    text: "text-pink-300",
    icon: "text-pink-400",
    bg: "bg-pink-500/8",
    border: "border-pink-500/30",
    hover: "hover:border-pink-500/40",
    ring: "border-pink-500/30",
    button: "bg-pink-600 hover:bg-pink-500",
  },

  fuchsia: {
    text: "text-fuchsia-300",
    icon: "text-fuchsia-400",
    bg: "bg-fuchsia-500/8",
    border: "border-fuchsia-500/30",
    hover: "hover:border-fuchsia-500/40",
    ring: "border-fuchsia-500/30",
    button: "bg-fuchsia-600 hover:bg-fuchsia-500",
  },

  purple: {
    text: "text-purple-300",
    icon: "text-purple-400",
    bg: "bg-purple-500/8",
    border: "border-purple-500/30",
    hover: "hover:border-purple-500/40",
    ring: "border-purple-500/30",
    button: "bg-purple-600 hover:bg-purple-500",
  },

  violet: {
    text: "text-violet-300",
    icon: "text-violet-400",
    bg: "bg-violet-500/8",
    border: "border-violet-500/30",
    hover: "hover:border-violet-500/40",
    ring: "border-violet-500/30",
    button: "bg-violet-600 hover:bg-violet-500",
  },

  indigo: {
    text: "text-indigo-300",
    icon: "text-indigo-400",
    bg: "bg-indigo-500/8",
    border: "border-indigo-500/30",
    hover: "hover:border-indigo-500/40",
    ring: "border-indigo-500/30",
    button: "bg-indigo-600 hover:bg-indigo-500",
  },

  slate: {
    text: "text-slate-300",
    icon: "text-slate-400",
    bg: "bg-slate-500/8",
    border: "border-slate-500/30",
    hover: "hover:border-slate-500/40",
    ring: "border-slate-500/30",
    button: "bg-slate-600 hover:bg-slate-500",
  },
}

export const getTheme = (name: color["name"]) => themeMap[name]