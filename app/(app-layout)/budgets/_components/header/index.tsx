"use client"

import { PageHeader } from "@/app/(app-layout)/_components/page-header"
import { useTranslations } from "next-intl"

export function BudgetsHeader() {
  const t = useTranslations("budgets.page")

  return <PageHeader title={t("title")} description={t("description")} />
}
