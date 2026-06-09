import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function HeaderSkeleton() {
  return (
    <div className="fixed top-0 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4 pt-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="hidden items-center gap-6 md:flex">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="relative h-[800px] w-full overflow-hidden bg-muted/30">
      <div className="absolute top-1/4 left-8 z-10 flex max-w-md flex-col items-start gap-5 md:left-16">
        <Skeleton className="h-12 w-72 max-w-full md:h-14 md:w-96" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="mt-2 h-11 w-36 rounded-lg" />
      </div>
      <div className="absolute right-10 bottom-20 hidden aspect-[7/5] w-[400px] lg:block">
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
    </div>
  )
}

function SectionHeaderSkeleton({
  centered = false,
  className,
}: {
  centered?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        centered ? "mx-auto max-w-2xl text-center" : "space-y-6",
        className
      )}
    >
      <Skeleton className={cn("h-4 w-24", centered && "mx-auto")} />
      <Skeleton
        className={cn(
          "h-9 w-80 max-w-full",
          centered ? "mx-auto mt-3" : "mt-0"
        )}
      />
      <Skeleton className={cn("h-5 w-full", centered ? "mx-auto mt-4" : "")} />
      <Skeleton className={cn("h-5 w-3/4 max-w-full", centered && "mx-auto")} />
    </div>
  )
}

function TextContentSkeleton({ listItems = 3 }: { listItems?: number }) {
  return (
    <div className="space-y-6">
      <SectionHeaderSkeleton />
      <ul className="space-y-3">
        {Array.from({ length: listItems }, (_, index) => (
          <li key={index} className="flex items-start gap-3">
            <Skeleton className="mt-1.5 h-2 w-2 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ImageSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        "aspect-[4/3] w-full rounded-2xl border border-border",
        className
      )}
    />
  )
}

function PillarCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

function FeatureCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-8 shadow-sm">
      <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
      <Skeleton className="h-6 w-36" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-4/5" />
    </div>
  )
}

function TestimonialCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-background p-8 shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  )
}

function CategoryRowSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-10" />
    </div>
  )
}

function RoadmapItemSkeleton({ alignRight = false }: { alignRight?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex flex-col pl-10 md:pl-0",
        alignRight ? "md:flex-row-reverse" : "md:flex-row",
        "md:items-start md:gap-10"
      )}
    >
      <Skeleton className="absolute top-1.5 left-[11px] z-10 h-2.5 w-2.5 rounded-full md:left-1/2 md:-translate-x-1/2" />
      <div
        className={cn(
          "md:w-1/2",
          alignRight ? "md:pl-10 md:text-left" : "md:pr-10 md:text-right"
        )}
      >
        <Skeleton
          className={cn(
            "mb-1 h-5 w-20 rounded-full",
            !alignRight && "md:ml-auto"
          )}
        />
        <Skeleton
          className={cn(
            "mt-1 h-6 w-56 max-w-full",
            !alignRight && "md:ml-auto"
          )}
        />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-4/5" />
      </div>
    </div>
  )
}

function FooterSkeleton() {
  return (
    <footer className="border-t border-border px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Skeleton className="mb-4 h-8 w-8" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="mt-2 h-4 w-4/5 max-w-sm" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-4 w-28" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-4 w-32" />
            ))}
          </div>
        </div>
        <Skeleton className="mx-auto mt-12 h-3 w-64" />
      </div>
    </footer>
  )
}

export function LandingPageLoadingLayout() {
  return (
    <div className="dark overflow-hidden bg-background text-foreground">
      <HeaderSkeleton />
      <HeroSkeleton />

      <section className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeaderSkeleton centered />
          <div className="mt-16 grid gap-10 text-left md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <PillarCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-6 py-12 md:px-12 md:py-24 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
            <TextContentSkeleton />
            <ImageSkeleton />
          </div>
        </div>
      </section>

      <section className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <ImageSkeleton className="order-2 md:order-1" />
            <div className="order-1 md:order-2">
              <TextContentSkeleton />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <TextContentSkeleton />
            <ImageSkeleton />
          </div>
        </div>
      </section>

      <section className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeaderSkeleton centered className="mb-16" />
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <FeatureCardSkeleton key={index} />
            ))}
          </div>
          <Skeleton className="mt-12 aspect-[21/9] w-full rounded-2xl border border-border" />
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <SectionHeaderSkeleton />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <CategoryRowSkeleton key={index} />
                ))}
              </div>
            </div>
            <ImageSkeleton />
          </div>
        </div>
      </section>

      <section className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeaderSkeleton centered className="mb-16" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <TestimonialCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeaderSkeleton centered className="mb-16" />
          <div className="relative space-y-12">
            <div className="absolute top-0 bottom-0 left-[15px] w-px bg-border md:left-1/2 md:-translate-x-px" />
            {Array.from({ length: 5 }, (_, index) => (
              <RoadmapItemSkeleton key={index} alignRight={index % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      <FooterSkeleton />
    </div>
  )
}
