import { AccountsHeader } from "./_components/header";
import { AccountTable } from "./_components/account-table";
import { getAccounts } from "./actions";
import { toast } from "sonner";
export default async function AccountsPage() {
    const { data, error } = await getAccounts()


    if (error) {
        toast.error(error || "Failed to fetch accounts")
    }


    return (
        <div>
            <AccountsHeader />
            <div className="p-4">
                <AccountTable accounts={data?.map((account) => ({
                    id: account.id,
                    userId: account.user_id,
                    name: account.name,
                    currentBalance: account.current_balance,
                    currency: account.currency,
                    isArchived: account.is_archived,
                    createdAt: account.created_at,
                    updatedAt: account.updated_at,
                })) ?? []} />
            </div>
        </div>
    )
}