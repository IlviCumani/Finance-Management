"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ColoredBadgeProps = {
  color: keyof typeof COLORS
  className?: string
  noBorder?: boolean
}

const COLORS: Record<string, string> = {
  red: "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none border-red-500",
  orange:
    "bg-orange-600/10 dark:bg-orange-600/20 hover:bg-orange-600/10 text-orange-500 border-orange-600/60 shadow-none",
  amber:
    "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none",
  emerald:
    "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none",
  sky: "bg-sky-600/10 dark:bg-sky-600/20 hover:bg-sky-600/10 text-sky-500 border-sky-600/60 shadow-none",
  indigo:
    "bg-indigo-600/10 dark:bg-indigo-600/20 hover:bg-indigo-600/10 text-indigo-500 border-indigo-600/60 shadow-none",
  purple:
    "bg-purple-600/10 dark:bg-purple-600/20 hover:bg-purple-600/10 text-purple-500 border-purple-600/60 shadow-none",
  pink: "bg-pink-600/10 dark:bg-pink-600/20 hover:bg-pink-600/10 text-pink-500 border-pink-600/60 shadow-none",
  rose: "bg-rose-600/10 dark:bg-rose-600/20 hover:bg-rose-600/10 text-rose-500 border-rose-600/60 shadow-none",
  cyan: "bg-cyan-600/10 dark:bg-cyan-600/20 hover:bg-cyan-600/10 text-cyan-500 border-cyan-600/60 shadow-none",
  teal: "bg-teal-600/10 dark:bg-teal-600/20 hover:bg-teal-600/10 text-teal-500 border-teal-600/60 shadow-none",
  lime: "bg-lime-600/10 dark:bg-lime-600/20 hover:bg-lime-600/10 text-lime-500 border-lime-600/60 shadow-none",
  green:
    "bg-green-600/10 dark:bg-green-600/20 hover:bg-green-600/10 text-green-500 border-green-600/60 shadow-none",
  blue: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 border-blue-600/60 shadow-none",
  violet:
    "bg-violet-600/10 dark:bg-violet-600/20 hover:bg-violet-600/10 text-violet-500 border-violet-600/60 shadow-none",
  yellow:
    "bg-yellow-600/10 dark:bg-yellow-600/20 hover:bg-yellow-600/10 text-yellow-500 border-yellow-600/60 shadow-none",
  gray: "bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10 text-gray-500 border-gray-600/60 shadow-none",
  white:
    "bg-white/10 dark:bg-white/20 hover:bg-white/10 text-white border-white/60 shadow-none",
  black:
    "bg-black/10 dark:bg-black/20 hover:bg-black/10 text-black border-black/60 shadow-none",
}

export function ColorBadge({
  color,
  children,
  className,
  noBorder = false,
  ...props
}: React.ComponentProps<typeof Badge> & ColoredBadgeProps) {
  return (
    <Badge
      className={cn(
        COLORS[color],
        "min-w-22 rounded-full font-bold",
        noBorder && "border-none",
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  )
}
