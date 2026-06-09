"use client"

import { motion } from "motion/react"
import { forwardRef, type CSSProperties, type ComponentProps } from "react"

import { cn } from "@/lib/utils"

export type NeonBorderMode = "always" | "hover"

export type NeonBorderProps = ComponentProps<"div"> & {
  color1: string
  color2?: string
  mode?: NeonBorderMode
  rounded?: string
  contentClassName?: string
}

export const NeonBorder = forwardRef<HTMLDivElement, NeonBorderProps>(
  function NeonBorder(
    {
      color1,
      color2 = color1,
      mode = "hover",
      rounded = "rounded-2xl",
      className,
      contentClassName,
      children,
      style,
      ...props
    },
    ref
  ) {
    const glowVisibility =
      mode === "always"
        ? "opacity-100"
        : "opacity-0 transition-opacity duration-500 group-hover:opacity-100"

    return (
      <div
        ref={ref}
        data-slot="neon-border"
        data-mode={mode}
        className={cn("group relative p-[3px]", rounded, className)}
        style={
          {
            "--neon-c1": color1,
            "--neon-c2": color2,
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-1 h-full overflow-hidden blur-md",
            rounded,
            glowVisibility
          )}
        >
          <div className="neon-border-glow" />
        </div>

        <div
          aria-hidden
          className={cn(
            "neon-border-wrap pointer-events-none",
            rounded,
            glowVisibility
          )}
        >
          <div className="neon-border-glow-intense" />
        </div>

        <div className={cn("relative z-10 h-full", contentClassName)}>
          {children}
        </div>
      </div>
    )
  }
)

NeonBorder.displayName = "NeonBorder"

export const MotionNeonBorder = motion.create(NeonBorder)
