import Image from "next/image"
import DashboardImage from "@/assets/temp-images/goku-blue.jpg"

export default function DashboardSection() {
  return (
    <section id="dashboard" className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
              Dashboard
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Your entire financial life, one glance away
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              No more hopping between bank apps and spreadsheets. The dashboard
              pulls every account, every balance, and every pending charge into
              a single view — so you always know exactly where you stand.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Real-time net worth across all connected accounts
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Monthly spending vs. income at a glance
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Upcoming bills and low-balance alerts
              </li>
            </ul>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-xl">
            <Image
              src={DashboardImage}
              alt="Dashboard preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              placeholder="blur"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
