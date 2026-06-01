import { TransactionCategoriesHeader } from "./_components/header"
import { TransactionCategoryTable } from "./_components/transaction-category-table"
import { getTransactionCategories } from "./actions"
import { toast } from "sonner"
import { getTranslations } from "next-intl/server"

export default async function TransactionCategoriesPage() {
    const t = await getTranslations("settings.transactionCategories.page")
    const { data, error } = await getTransactionCategories()

    if (error) {
        toast.error(error || t("fetchError"))
    }

    return (
        <div>
            <TransactionCategoriesHeader />
            <div className="p-4">
                <TransactionCategoryTable
                    categories={data?.map((category) => ({
                        id: category.id,
                        userId: category.user_id,
                        name: category.name,
                        type: category.type,
                        createdAt: category.created_at,
                        updatedAt: category.updated_at,
                    })) ?? []}
                />
            </div>
        </div>
    )
}
