"use client"

import {
  ScrollReveal,
  StaggerItem,
  fadeUp,
  springPop,
  staggerContainer,
} from "@/components/page-status/landing-page/components/ui/scroll-reveal"

const pillars = [
  {
    title: "Speed over ceremony",
    description:
      "Log a transaction in seconds, not minutes. Every screen is designed to get out of your way and let you move on with your day.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: "Your data, your device",
    description:
      "No bank logins, no third-party scraping. You enter what you want, when you want. Everything is encrypted and stays under your control.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    ),
  },
  {
    title: "Free and open",
    description:
      "No premium tiers, no paywalled charts. The full experience is available to everyone — because managing money shouldn't cost more money.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl text-center">
        <ScrollReveal variants={fadeUp}>
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            About
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Built for people, not accountants
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Most finance tools assume you already know what you&apos;re doing.
            This one doesn&apos;t. We built it for the person who checks their
            bank app three times a day and still can&apos;t tell where the money
            went.
          </p>
        </ScrollReveal>

        <ScrollReveal
          className="mt-16 grid gap-10 text-left md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
        >
          {pillars.map((pillar) => (
            <StaggerItem
              key={pillar.title}
              variants={springPop}
              className="space-y-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {pillar.icon}
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground">{pillar.description}</p>
            </StaggerItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
