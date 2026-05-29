"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

export function AppSidebarTrigger() {
    const t = useTranslations("common")

    return <SidebarTrigger toggleLabel={t("toggleSidebar")} />
}
