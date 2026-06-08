export default function RoadmapSection() {
  const milestones = [
    {
      status: "done" as const,
      quarter: "Launched",
      title: "Core Dashboard & Transactions",
      description:
        "Manual account creation, transaction logging, category tagging, and the at-a-glance dashboard you see today.",
    },
    {
      status: "current" as const,
      quarter: "In Progress",
      title: "Recurring Payments & Alerts",
      description:
        "Auto-detection of subscriptions, calendar view of upcoming charges, and configurable reminders before each billing cycle.",
    },
    {
      status: "upcoming" as const,
      quarter: "Next Up",
      title: "Budgets & Spending Goals",
      description:
        "Set monthly limits per category, track progress in real time, and receive a gentle nudge when you're close to the edge.",
    },
    {
      status: "upcoming" as const,
      quarter: "Planned",
      title: "Reports & Insights",
      description:
        "Monthly and yearly summaries, trend comparisons, and visual breakdowns that turn raw numbers into clear answers.",
    },
    {
      status: "upcoming" as const,
      quarter: "Exploring",
      title: "Multi-user & Shared Households",
      description:
        "Invite a partner or family member, share selected accounts, and split shared expenses without the awkward spreadsheet.",
    },
  ]

  return (
    <section id="roadmap" className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Roadmap
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Where we&apos;ve been, where we&apos;re headed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            This project is built in the open. Here&apos;s what&apos;s shipped,
            what&apos;s in the workshop, and what&apos;s coming down the road.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[15px] w-px bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0

              const dotColor =
                m.status === "done"
                  ? "bg-primary"
                  : m.status === "current"
                    ? "bg-primary animate-pulse"
                    : "bg-border"

              return (
                <div
                  key={m.title}
                  className={`relative flex flex-col pl-10 md:pl-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } md:items-start md:gap-10`}
                >
                  <div
                    className={`absolute top-1.5 left-[11px] z-10 h-2.5 w-2.5 rounded-full ring-4 ring-background ${dotColor} md:left-1/2 md:-translate-x-1/2`}
                  />

                  <div
                    className={`md:w-1/2 ${isLeft ? "md:pr-10 md:text-right" : "md:pl-10 md:text-left"}`}
                  >
                    <span className="mb-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                      {m.quarter}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      {m.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
