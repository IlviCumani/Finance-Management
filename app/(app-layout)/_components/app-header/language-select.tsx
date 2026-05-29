"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

import { setLocaleCookie } from "@/app/(app-layout)/_components/app-header/locale"
import { locales, type Locale } from "@/i18n/config"
import { writeStoredLocale } from "@/i18n/locale-storage"

const LANGUAGE_META: Record<
    Locale,
    { countryCode: string; messageKey: "en" | "sq" }
> = {
    en: { countryCode: "us", messageKey: "en" },
    sq: { countryCode: "al", messageKey: "sq" },
}

function LanguageFlagCircle({
    countryCode,
    title,
}: {
    countryCode: string
    title: string
}) {
    return (
        <span
            className="relative size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-border/60"
            title={title}
        >
            <Image
                src={`https://flagcdn.com/w40/${countryCode}.png`}
                alt=""
                fill
                className="object-fill"
                sizes="18px"
            />
        </span>
    )
}

export function LanguageSelect() {
    const locale = useLocale() as Locale
    const t = useTranslations("language")
    const [isPending, startTransition] = useTransition()

    const selectedLabel = t(LANGUAGE_META[locale].messageKey)
    const selectedCountryCode = LANGUAGE_META[locale].countryCode

    function onLocaleChange(nextLocale: string) {
        if (!locales.includes(nextLocale as Locale)) return

        const chosen = nextLocale as Locale
        writeStoredLocale(chosen)

        startTransition(async () => {
            await setLocaleCookie(chosen)
        })
    }

    return (
        <Select
            value={locale}
            onValueChange={onLocaleChange}
            disabled={isPending}
        >
            <SelectTrigger
                className="h-9 w-fit min-w-9 shrink-0 gap-1.5 px-2"
                aria-label={t("ariaLabel", { language: selectedLabel })}
            >
                <SelectValue className="sr-only" placeholder={t("placeholder")}>
                    <span
                        className="flex items-center justify-center"
                        aria-hidden
                    >
                        <LanguageFlagCircle
                            countryCode={selectedCountryCode}
                            title={selectedLabel}
                        />
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent align="end" position="popper">
                {locales.map((itemLocale) => {
                    const { countryCode, messageKey } = LANGUAGE_META[itemLocale]
                    const label = t(messageKey)

                    return (
                        <SelectItem
                            key={itemLocale}
                            value={itemLocale}
                            textValue={label}
                        >
                            <span className="flex items-center gap-2.5">
                                <LanguageFlagCircle
                                    countryCode={countryCode}
                                    title={label}
                                />
                                <span>{label}</span>
                            </span>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
