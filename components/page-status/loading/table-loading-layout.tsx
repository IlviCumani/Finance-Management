import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type TableLoadingCellVariant = "text" | "switch" | "actions"

export type TableLoadingColumn = {
  width?: string
  variant?: TableLoadingCellVariant
}

export type TableLoadingLayoutProps = {
  className?: string
  contentClassName?: string
  showPageHeader?: boolean
  showBreadcrumb?: boolean
  showHeaderDescription?: boolean
  showHeaderActions?: boolean
  headerActionCount?: number
  showToolbar?: boolean
  toolbarActionCount?: number
  showPagination?: boolean
  columns?: number | TableLoadingColumn[]
  rowCount?: number
}

const DEFAULT_COLUMN_WIDTHS = [
  "w-28",
  "w-20",
  "w-16",
  "w-24",
  "w-32",
  "w-16",
] as const

const CELL_VARIANT_CLASS: Record<TableLoadingCellVariant, string> = {
  text: "h-4",
  switch: "h-6 w-11 rounded-full",
  actions: "h-8 w-16",
}

function resolveColumns(
  columns: number | TableLoadingColumn[] | undefined
): TableLoadingColumn[] {
  if (Array.isArray(columns)) {
    return columns.length > 0 ? columns : [{ variant: "text" }]
  }

  const count = columns ?? 6
  return Array.from({ length: count }, (_, index) => ({
    width: DEFAULT_COLUMN_WIDTHS[index % DEFAULT_COLUMN_WIDTHS.length],
    variant: "text" as const,
  }))
}

function SkeletonCell({ column }: { column: TableLoadingColumn }) {
  const variant = column.variant ?? "text"

  if (variant === "text") {
    return (
      <Skeleton
        className={cn(CELL_VARIANT_CLASS.text, column.width ?? "w-20")}
      />
    )
  }

  return <Skeleton className={CELL_VARIANT_CLASS[variant]} />
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
            <Skeleton className="h-8 w-36" />
            {showDescription ? (
              <Skeleton className="h-4 w-72 max-w-full" />
            ) : null}
          </div>
        </div>
        {showActions ? (
          <div className="flex shrink-0 items-center gap-2">
            {Array.from({ length: actionCount }, (_, index) => (
              <Skeleton key={index} className="h-9 w-32" />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  )
}

function TableToolbarSkeleton({ actionCount }: { actionCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-full max-w-xs" />
      {Array.from({ length: actionCount }, (_, index) => (
        <Skeleton key={index} className="h-9 w-36" />
      ))}
    </div>
  )
}

function TablePaginationSkeleton() {
  return (
    <div className="flex w-full items-center justify-between gap-2 border-t p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="hidden h-4 w-24 sm:block" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
      </div>
    </div>
  )
}

export function TableLoadingLayout({
  className,
  contentClassName,
  showPageHeader = true,
  showBreadcrumb = false,
  showHeaderDescription = true,
  showHeaderActions = true,
  headerActionCount = 1,
  showToolbar = true,
  toolbarActionCount = 1,
  showPagination = true,
  columns,
  rowCount = 8,
}: TableLoadingLayoutProps) {
  const resolvedColumns = resolveColumns(columns)

  return (
    <div className={className}>
      {showPageHeader ? (
        <PageHeaderSkeleton
          showBreadcrumb={showBreadcrumb}
          showDescription={showHeaderDescription}
          showActions={showHeaderActions}
          actionCount={headerActionCount}
        />
      ) : null}
      <div className={cn("p-4", contentClassName)}>
        <div className="flex flex-col gap-2">
          {showToolbar ? (
            <TableToolbarSkeleton actionCount={toolbarActionCount} />
          ) : null}
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted font-bold">
                <TableRow>
                  {resolvedColumns.map((column, columnIndex) => (
                    <TableHead key={columnIndex} className="py-2">
                      <SkeletonCell column={column} />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: rowCount }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {resolvedColumns.map((column, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <SkeletonCell column={column} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {showPagination ? <TablePaginationSkeleton /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
