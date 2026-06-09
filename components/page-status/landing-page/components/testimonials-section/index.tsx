"use client"

import { MotionNeonBorder } from "@/components/ui/neon-border"
import {
  ScrollReveal,
  fadeUp,
  scaleIn,
  staggerContainer,
} from "@/components/page-status/landing-page/components/ui/scroll-reveal"

const testimonials = [
  {
    quote:
      "I used to forget about subscriptions until the charge hit. Now I catch them a week early every time.",
    name: "Arta M.",
    role: "Freelance designer",
  },
  {
    quote:
      "Finally a finance app that doesn't make me feel like I need a degree in accounting just to see where my money goes.",
    name: "Dritan K.",
    role: "Software engineer",
  },
  {
    quote:
      "The dashboard alone replaced three spreadsheets and two apps. I open it once in the morning and I'm set.",
    name: "Elira B.",
    role: "Small business owner",
  },
  {
    quote:
      "I added all my accounts in five minutes. No bank login, no API keys — just names and balances. That's it.",
    name: "Fatos R.",
    role: "University student",
  },
  {
    quote:
      "Categories auto-sort almost perfectly. The few I corrected it remembered. Saves me so much time every week.",
    name: "Genta S.",
    role: "Marketing manager",
  },
  {
    quote:
      "I showed the roadmap to my partner and he immediately signed up. Knowing what's coming builds real trust.",
    name: "Liria H.",
    role: "Product manager",
  },
]

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-16 text-center" variants={fadeUp}>
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            People who stopped guessing about their money
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Real feedback from early users who made the switch from chaos to
            clarity.
          </p>
        </ScrollReveal>

        <ScrollReveal
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
        >
          {testimonials.map((t) => (
            <MotionNeonBorder
              key={t.name}
              variants={scaleIn}
              mode="hover"
              color1="oklch(0.627 0.194 149.214)"
              color2="oklch(0.845 0.143 164.978)"
              className="h-full"
              contentClassName="flex h-full flex-col justify-between rounded-[calc(var(--radius-2xl)-3px)] border border-border bg-background p-8 shadow-sm"
            >
              <blockquote className="text-foreground">
                <p className="leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </MotionNeonBorder>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
