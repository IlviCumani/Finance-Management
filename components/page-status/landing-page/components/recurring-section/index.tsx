"use client"

import Image from "next/image"
import RecurringImage from "@/assets/temp-images/goku-yellow.avif"
import { motion } from "motion/react"
import {
  ScrollReveal,
  StaggerItem,
  scrollViewport,
  flipUp,
  staggerContainer,
  fadeUp,
} from "@/components/page-status/landing-page/components/ui/scroll-reveal"

const listItems = [
  "Auto-detected subscriptions and fixed bills",
  "Calendar view of upcoming charges",
  "Alerts before each renewal hits your account",
]

export default function RecurringSection() {
  return (
    <section id="recurring" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <ScrollReveal
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            style={{ transformPerspective: 800 }}
          >
            <StaggerItem variants={flipUp}>
              <span className="text-sm font-semibold tracking-widest text-primary uppercase">
                Recurring Payments
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Subscriptions under control, not under the radar
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                That forgotten streaming trial from eight months ago? We see it.
                Recurring payments are surfaced, tracked, and totaled so you can
                decide what stays and what gets cancelled — before the next
                billing cycle.
              </p>
            </StaggerItem>
            <ul className="space-y-3 text-muted-foreground">
              {listItems.map((item) => (
                <StaggerItem
                  key={item}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </StaggerItem>
              ))}
            </ul>
          </ScrollReveal>

          <motion.div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-xl"
            initial={{ opacity: 0, scale: 0.75, rotateY: -18 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={scrollViewport}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformPerspective: 900 }}
          >
            <Image
              src={RecurringImage}
              alt="Recurring payments preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
