import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function AddBudgetCategoryCard() {
  return (
    <Card className="min-h-56">
      <CardContent className="flex h-full flex-col items-center justify-center gap-2">
        <HugeiconsIcon icon={PlusSignCircleIcon} className="size-10" />
        <CardDescription className="text-sm font-medium">
          Add Budget Category
        </CardDescription>
      </CardContent>
    </Card>
  )
}
