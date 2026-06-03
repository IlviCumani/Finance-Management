import { AccountsHeader } from "./_components/header"
import { AccountTable } from "./_components/account-table"
import { getAccounts } from "./actions"
import { toast } from "sonner"
import { getTranslations } from "next-intl/server"

export default async function AccountsPage() {
  const t = await getTranslations("accounts.page")
  const { data, error } = await getAccounts()

  if (error) {
    toast.error(error || t("fetchError"))
  }

  return (
    <div>
      <AccountsHeader />
      <div className="p-4">
        <AccountTable accounts={data ?? []} />
      </div>
    </div>
  )
}
