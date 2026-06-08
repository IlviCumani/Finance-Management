import Image from "next/image"
import TransactionsImage from "@/assets/temp-images/goku-red.jpg"

export default function TransactionsSection() {
  return (
    <section
      id="transactions"
      className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-xl md:order-1">
            <Image
              src={TransactionsImage}
              alt="Transaction tracking preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              placeholder="blur"
            />
          </div>

          <div className="order-1 space-y-6 md:order-2">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
              Transactions
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Every dollar, accounted for
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Transactions flow in automatically and get tagged the moment they
              land. Search by merchant, amount, date, or category — and finally
              stop wondering where last Tuesday&apos;s coffee money went.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Instant search and smart filters across all accounts
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Automatic merchant recognition and tagging
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-primary" />
                Split, annotate, or attach receipts to any entry
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
