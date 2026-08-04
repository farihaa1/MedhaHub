export const progressColors = {
  green: "[&>div]:bg-green-500",
  blue: "[&>div]:bg-blue-500",
  orange: "[&>div]:bg-orange-500",
  purple: "[&>div]:bg-purple-500",
  pink: "[&>div]:bg-pink-500",
} as const

export type ProgressColor = keyof typeof progressColors
