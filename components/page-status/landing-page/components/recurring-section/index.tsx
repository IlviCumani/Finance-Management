import Image from "next/image"
import RecurringImage from "@/assets/temp-images/goku-yellow.avif"

export default function RecurringSection() {
  return (
    <section id="recurring" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
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
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Auto-detected subscriptions and fixed bills
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Calendar view of upcoming charges
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Alerts before each renewal hits your account
              </li>
            </ul>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-xl">
            <Image
              src={RecurringImage}
              alt="Recurring payments preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
