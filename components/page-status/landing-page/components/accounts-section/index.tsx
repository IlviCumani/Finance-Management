import Image from "next/image"
import AccountsImage from "@/assets/temp-images/goku-blue.jpg"

export default function AccountsSection() {
  return (
    <section id="accounts" className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Accounts
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            All your money, all in one place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Checking, savings, credit cards, cash — add as many accounts as you
            need and see how they move together. No more mental arithmetic
            across five different apps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Multi-currency ready
            </h3>
            <p className="mt-2 text-muted-foreground">
              Track accounts in different currencies and see converted totals in
              the currency you think in.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Balance history
            </h3>
            <p className="mt-2 text-muted-foreground">
              See how each account has grown — or shrunk — over weeks, months,
              and years with clear trend lines.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Private by default
            </h3>
            <p className="mt-2 text-muted-foreground">
              Your data stays yours. Balances are stored encrypted and never
              shared with third parties.
            </p>
          </div>
        </div>

        <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border shadow-xl">
          <Image
            src={AccountsImage}
            alt="Accounts overview preview"
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  )
}
