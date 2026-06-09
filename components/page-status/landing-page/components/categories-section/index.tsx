"use client"

import Image from "next/image"
import CategoriesImage from "@/assets/temp-images/goku-red.jpg"
import { motion } from "motion/react"
import {
  ScrollReveal,
  StaggerItem,
  scrollViewport,
  staggerContainer,
  fadeUp,
  tiltIn,
} from "@/components/page-status/landing-page/components/ui/scroll-reveal"

const categories = [
  { name: "Housing", color: "bg-emerald-500", pct: "35%" },
  { name: "Food & Dining", color: "bg-teal-500", pct: "20%" },
  { name: "Transport", color: "bg-cyan-500", pct: "12%" },
  { name: "Entertainment", color: "bg-sky-500", pct: "10%" },
  { name: "Utilities", color: "bg-indigo-500", pct: "8%" },
  { name: "Everything else", color: "bg-violet-500", pct: "15%" },
]

export default function CategoriesSection() {
  return (
    <section id="categories" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <ScrollReveal
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
          >
            <StaggerItem variants={fadeUp}>
              <span className="text-sm font-semibold tracking-widest text-primary uppercase">
                Categories
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Know where every cent is going
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Transactions are automatically sorted into categories that
                actually make sense. Customize them, merge them, colour-code
                them — your budget, your rules.
              </p>
            </StaggerItem>

            <div className="space-y-3 pt-2">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={scrollViewport}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.span
                    className={`block h-3 w-3 shrink-0 rounded-full ${cat.color}`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={scrollViewport}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 18,
                      delay: index * 0.08 + 0.15,
                    }}
                  />
                  <span className="flex-1 text-sm text-foreground">
                    {cat.name}
                  </span>
                  <motion.span
                    className="text-sm font-medium text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={scrollViewport}
                    transition={{ delay: index * 0.08 + 0.25, duration: 0.4 }}
                  >
                    {cat.pct}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal variants={tiltIn}>
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border shadow-xl">
              <Image
                src={CategoriesImage}
                alt="Categories breakdown preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
