"use client"

import {
  ScrollReveal,
  StaggerItem,
  blurFade,
  staggerContainer,
  fadeUp,
} from "@/components/page-status/landing-page/components/ui/scroll-reveal"

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16 md:px-12 lg:px-24">
      <ScrollReveal
        className="mx-auto max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
      >
        <div className="grid gap-10 md:grid-cols-4">
          <StaggerItem className="md:col-span-2" variants={blurFade}>
            <img src="/app-logo/favicon.svg" alt="Logo" className="mb-4 h-8" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A personal finance tool built for clarity, not complexity. Track
              what matters, ignore what doesn&apos;t.
            </p>
          </StaggerItem>

          <StaggerItem variants={fadeUp}>
            <h4 className="mb-3 text-sm font-semibold tracking-wider text-foreground uppercase">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#dashboard"
                  className="transition-colors hover:text-foreground"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#transactions"
                  className="transition-colors hover:text-foreground"
                >
                  Transactions
                </a>
              </li>
              <li>
                <a
                  href="#recurring"
                  className="transition-colors hover:text-foreground"
                >
                  Recurring Payments
                </a>
              </li>
            </ul>
          </StaggerItem>

          <StaggerItem variants={fadeUp}>
            <h4 className="mb-3 text-sm font-semibold tracking-wider text-foreground uppercase">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#accounts"
                  className="transition-colors hover:text-foreground"
                >
                  Accounts
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="transition-colors hover:text-foreground"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="transition-colors hover:text-foreground"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="transition-colors hover:text-foreground"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="transition-colors hover:text-foreground"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </StaggerItem>
        </div>

        <StaggerItem
          className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground"
          variants={blurFade}
        >
          &copy; {new Date().getFullYear()} Finance Management. All rights
          reserved.
        </StaggerItem>
      </ScrollReveal>
    </footer>
  )
}
