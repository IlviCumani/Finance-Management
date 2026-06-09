"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"

type TypewriterTextProps = {
  text: string
  className?: string
  speed?: number
  delay?: number
}

export default function TypewriterText({
  text,
  className,
  speed = 12,
  delay = 300,
}: TypewriterTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    if (!isInView) return

    let interval: ReturnType<typeof setInterval> | undefined

    const startTimer = setTimeout(() => {
      let index = 0
      interval = setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index >= text.length && interval) {
          clearInterval(interval)
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(startTimer)
      if (interval) clearInterval(interval)
    }
  }, [isInView, text, speed, delay])

  return (
    <p ref={ref} className={cn("mt-1 text-muted-foreground", className)}>
      {displayed}
    </p>
  )
}
