import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ComponentType, ReactNode } from "react"

export type GridLoadingLayoutProps = {
  className?: string
  contentClassName?: string
  showPageHeader?: boolean
  showBreadcrumb?: boolean
  showHeaderDescription?: boolean
  showHeaderActions?: boolean
  headerActionCount?: number
  headerTitleClassName?: string
  headerDescriptionClassName?: string
  cardCount?: number
  minCardWidth?: string
  cardSkeleton?: ComponentType
  trailingCard?: ComponentType
  beforeGrid?: ReactNode
}

function PageHeaderSkeleton({
  showBreadcrumb,
  showDescription,
  showActions,
  actionCount,
  titleClassName,
  descriptionClassName,
}: {
  showBreadcrumb: boolean
  showDescription: boolean
  showActions: boolean
  actionCount: number
  titleClassName: string
  descriptionClassName: string
}) {
  return (
    <header className="border-b bg-secondary/50 py-4">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 max-sm:flex-col max-sm:items-start">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          {showBreadcrumb ? <Skeleton className="h-4 w-40" /> : null}
          <div className="flex flex-col gap-2">
            <Skeleton className={cn("h-8", titleClassName)} />
            {showDescription ? (
              <Skeleton
                className={cn("h-4 max-w-full", descriptionClassName)}
              />
            ) : null}
          </div>
        </div>
        {showActions ? (
          <div className="flex shrink-0 items-center gap-2">
            {Array.from({ length: actionCount }, (_, index) => (
              <Skeleton key={index} className="h-9 w-52" />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  )
}

export function RecurringTransactionCardSkeleton() {
  return (
    <Card className="h-full pb-0">
      <CardHeader className="gap-5">
        <CardAction>
          <Skeleton className="h-6 w-11 rounded-full" />
        </CardAction>
        <div className="flex items-center gap-2">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Skeleton className="h-4 w-full max-w-xs" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-9 w-28" />
        <Skeleton className="mt-4 h-4 w-40" />
      </CardContent>
      <CardFooter className="mt-auto justify-between border-t border-border bg-accent/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="size-7 rounded-md" />
      </CardFooter>
    </Card>
  )
}

export function TotalBudgetCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="flex justify-between max-sm:flex-col max-sm:gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-end">
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  )
}

export function BudgetCategoryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48 max-w-full" />
        </div>
        <Skeleton className="size-7 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function AddGridCardSkeleton() {
  return (
    <Card className="min-h-56">
      <CardContent className="flex h-full flex-col items-center justify-center gap-2">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </CardContent>
    </Card>
  )
}

export function GridLoadingLayout({
  className,
  contentClassName,
  showPageHeader = true,
  showBreadcrumb = false,
  showHeaderDescription = true,
  showHeaderActions = true,
  headerActionCount = 1,
  headerTitleClassName = "w-52",
  headerDescriptionClassName = "w-72",
  cardCount = 6,
  minCardWidth = "20rem",
  cardSkeleton: CardSkeleton = RecurringTransactionCardSkeleton,
  trailingCard: TrailingCard,
  beforeGrid,
}: GridLoadingLayoutProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {showPageHeader ? (
        <PageHeaderSkeleton
          showBreadcrumb={showBreadcrumb}
          showDescription={showHeaderDescription}
          showActions={showHeaderActions}
          actionCount={headerActionCount}
          titleClassName={headerTitleClassName}
          descriptionClassName={headerDescriptionClassName}
        />
      ) : null}
      <div className={cn("flex-1 p-4", contentClassName)}>
        <div className={cn(beforeGrid ? "space-y-4" : undefined)}>
          {beforeGrid}
          <div
            className="grid gap-4 max-sm:grid-cols-1"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`,
            }}
          >
            {Array.from({ length: cardCount }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
            {TrailingCard ? <TrailingCard /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
