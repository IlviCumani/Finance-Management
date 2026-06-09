const features: Array<string> = [
  "Real-time net worth across all connected accounts",
  "Monthly spending vs. income at a glance",
  "Upcoming bills and low-balance alerts",
]

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <span className="text-sm font-semibold tracking-widest text-primary uppercase">
        Dashboard
      </span>
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Your entire financial life, one glance away
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">
        No more hopping between bank apps and spreadsheets. The dashboard pulls
        every account, every balance, and every pending charge into a single
        view — so you always know exactly where you stand.
      </p>
      <ul className="space-y-3 text-muted-foreground">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}
