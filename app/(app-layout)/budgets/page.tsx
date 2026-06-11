import { BudgetsHeader } from "./_components/header"
import { BudgetGrid } from "./_components/budget-grid"
import { BudgetCategory } from "@/types/budget/budget-types"

export default async function BudgetsPage() {
  const totalBudget = 900
  const budgetCategories: Array<BudgetCategory> = [
    {
      id: "1",
      name: "Entertainment",
      description: "Movies, Games, Events",
      amount: 320,
      limit: 350,
    },
    {
      id: "2",
      name: "Food",
      description: "Restaurants, Groceries, Snacks",
      amount: 250,
      limit: 250,
    },
    {
      id: "3",
      name: "Transportation",
      description: "Public Transport, Gas, Maintenance",
      amount: 160,
      limit: 150,
    },
    {
      id: "4",
      name: "Housing",
      description: "Rent, Utilities, Maintenance",
      amount: 100,
      limit: 120,
    },
    {
      id: "5",
      name: "Health",
      description: "Insurance, Medications, Gym",
      amount: 50,
      limit: 60,
    },
    {
      id: "6",
      name: "Education",
      description: "Books, Courses, Tuition",
      amount: 30,
      limit: 40,
    },
    {
      id: "7",
      name: "Other",
      description: "Miscellaneous",
      amount: 20,
      limit: 30,
    },
  ]

  return (
    <div>
      <BudgetsHeader />
      <div className="p-4">
        <BudgetGrid
          totalBudget={totalBudget}
          budgetCategories={budgetCategories}
        />
      </div>
    </div>
  )
}
