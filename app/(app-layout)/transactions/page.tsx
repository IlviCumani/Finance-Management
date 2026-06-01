import { TransactionsHeader } from "./_components/header"
import { TransactionTable } from "./_components/transaction-table"
import { getTransactions } from "./actions"
import { toast } from "sonner"
import { getTranslations } from "next-intl/server"

export default async function TransactionsPage() {
    const t = await getTranslations("transactions.page")
    const { data, error } = await getTransactions()

    if (error) {
        toast.error(error || t("fetchError"))
    }

    return (
        <div>
            <TransactionsHeader />
            <div className="p-4">
                <TransactionTable transactions={data?.map((transaction) => ({
                    id: transaction.id,
                })) ?? []} />
            </div>
        </div>
    )
}
