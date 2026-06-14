import {
  AddGridCardSkeleton,
  BudgetCategoryCardSkeleton,
  GridLoadingLayout,
  TotalBudgetCardSkeleton,
} from "@/components/page-status/loading/grid-loading-layout"

export default function BudgetsLoading() {
  return (
    <GridLoadingLayout
      showHeaderActions={false}
      headerTitleClassName="w-36"
      headerDescriptionClassName="w-48"
      cardCount={3}
      cardSkeleton={BudgetCategoryCardSkeleton}
      trailingCard={AddGridCardSkeleton}
      beforeGrid={<TotalBudgetCardSkeleton />}
    />
  )
}
