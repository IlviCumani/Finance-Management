"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"

import { setLocaleCookie } from "@/app/(app-layout)/_components/app-header/locale"
import { readStoredLocale, writeStoredLocale } from "@/i18n/locale-storage"
import type { Locale } from "@/i18n/config"


export function LocaleSync() {
    const locale = useLocale() as Locale
    const router = useRouter()
    const hasSynced = useRef(false)

    useEffect(() => {
        if (hasSynced.current) return
        hasSynced.current = true

        const stored = readStoredLocale()

        if (stored && stored !== locale) {
            void setLocaleCookie(stored).then(() => router.refresh())
            return
        }

        writeStoredLocale(locale)
    }, [locale, router])

    return null
}
