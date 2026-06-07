import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type DashboardLoadingLayoutProps = {
  className?: string
  contentClassName?: string
  showPageHeader?: boolean
  showHeaderDescription?: boolean
}

function PageHeaderSkeleton({ showDescription }: { showDescription: boolean }) {
  return (
    <header className="border-b bg-secondary/50 py-4">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 max-sm:flex-col max-sm:items-start">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-36" />
            {showDescription ? (
              <Skeleton className="h-4 w-72 max-w-full" />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

function InformationCardSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-lg border bg-card p-4 shadow-sm">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="size-8 rounded-md" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="col-span-2 h-px w-full" />
      <Skeleton className="col-span-2 h-4 w-40" />
      <Skeleton className="col-span-2 h-4 w-56" />
    </div>
  )
}

function ChartCardSkeleton({
  className,
  chartHeight = 300,
  showFooter = false,
}: {
  className?: string
  chartHeight?: number
  showFooter?: boolean
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </CardHeader>
      <CardContent className="pl-0">
        <Skeleton className="w-full" style={{ height: chartHeight }} />
      </CardContent>
      {showFooter ? (
        <CardFooter className="mt-auto items-center justify-between border-t">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-24" />
        </CardFooter>
      ) : null}
    </Card>
  )
}

function SubscriptionItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

function RecurringSubscriptionsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 4 }, (_, index) => (
          <SubscriptionItemSkeleton key={index} />
        ))}
      </CardContent>
      <CardFooter className="mt-auto items-center justify-between border-t">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-24" />
      </CardFooter>
    </Card>
  )
}

export function DashboardLoadingLayout({
  className,
  contentClassName,
  showPageHeader = true,
  showHeaderDescription = true,
}: DashboardLoadingLayoutProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {showPageHeader ? (
        <PageHeaderSkeleton showDescription={showHeaderDescription} />
      ) : null}
      <div className={cn("flex-1 p-4", contentClassName)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <InformationCardSkeleton key={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartCardSkeleton
              className="col-span-1 lg:col-span-2"
              chartHeight={300}
            />
            <ChartCardSkeleton chartHeight={280} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCardSkeleton chartHeight={450} showFooter />
            <RecurringSubscriptionsCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
