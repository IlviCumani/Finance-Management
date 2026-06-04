"use client"

import { PageHeader } from "@/app/(app-layout)/_components/page-header"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { TransactionCategoryForm } from "../transaction-category-form"

export function TransactionCategoriesHeader() {
  const t = useTranslations("settings.transactionCategories.page")
  const [open, setOpen] = useState(false)
  return (
    <PageHeader
      title={t("title")}
      description={t("description")}
      links={[
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Settings",
          href: "#",
        },
      ]}
    >
      <TransactionCategoryForm open={open} onOpenChange={setOpen} />
      <div>
        <Button onClick={() => setOpen(true)}>
          <HugeiconsIcon icon={PlusSignCircleIcon} />
          {t("addTransactionCategory")}
        </Button>
      </div>
    </PageHeader>
  )
}
