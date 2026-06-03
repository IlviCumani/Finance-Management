import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardAction, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type GridLoadingLayoutProps = {
    className?: string
    contentClassName?: string
    showPageHeader?: boolean
    showBreadcrumb?: boolean
    showHeaderDescription?: boolean
    showHeaderActions?: boolean
    headerActionCount?: number
    cardCount?: number
    minCardWidth?: string
}

function PageHeaderSkeleton({
    showBreadcrumb,
    showDescription,
    showActions,
    actionCount,
}: {
    showBreadcrumb: boolean
    showDescription: boolean
    showActions: boolean
    actionCount: number
}) {
    return (
        <header className="border-b bg-secondary/50 py-4">
            <div className="mx-auto flex items-center justify-between gap-4 px-4 max-sm:flex-col max-sm:items-start">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                    {showBreadcrumb ? <Skeleton className="h-4 w-40" /> : null}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-52" />
                        {showDescription ? (
                            <Skeleton className="h-4 w-72 max-w-full" />
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

function RecurringTransactionCardSkeleton() {
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

export function GridLoadingLayout({
    className,
    contentClassName,
    showPageHeader = true,
    showBreadcrumb = false,
    showHeaderDescription = true,
    showHeaderActions = true,
    headerActionCount = 1,
    cardCount = 6,
    minCardWidth = "20rem",
}: GridLoadingLayoutProps) {
    return (
        <div className={cn("flex h-full flex-col", className)}>
            {showPageHeader ? (
                <PageHeaderSkeleton
                    showBreadcrumb={showBreadcrumb}
                    showDescription={showHeaderDescription}
                    showActions={showHeaderActions}
                    actionCount={headerActionCount}
                />
            ) : null}
            <div className={cn("flex-1 p-4", contentClassName)}>
                <div
                    className="grid gap-4 max-sm:grid-cols-1"
                    style={{
                        gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`,
                    }}
                >
                    {Array.from({ length: cardCount }, (_, index) => (
                        <RecurringTransactionCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}
