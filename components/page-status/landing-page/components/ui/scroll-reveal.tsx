"use client"

import { motion, type Variants } from "motion/react"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

export const scrollViewport = {
  once: true,
  amount: 0.25,
  margin: "-80px 0px",
} as const

type MotionDivProps = ComponentPropsWithoutRef<typeof motion.div>

type ScrollRevealProps = MotionDivProps & {
  variants?: Variants
}

export function ScrollReveal({
  className,
  variants,
  initial = "hidden",
  whileInView = "visible",
  viewport = scrollViewport,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      {...props}
    />
  )
}

export function StaggerItem({
  className,
  variants,
  ...props
}: ScrollRevealProps) {
  return <motion.div className={cn(className)} variants={variants} {...props} />
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -72, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 72, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const springPop: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
}

export const flipUp: Variants = {
  hidden: { opacity: 0, rotateX: 28, y: 40, transformPerspective: 800 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export const tiltIn: Variants = {
  hidden: { opacity: 0, rotate: -4, scale: 0.94, y: 32 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

export const blurFade: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 20 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}
