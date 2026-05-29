"use client"

import {
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import { PropsWithChildren } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

type CardLayoutProps = {
    title: string
    description: string
    size?: "sm" | "md" | "lg" | "xl"
}

export default function CardLayout({
    title,
    description,
    children,
    size = "md",
}: PropsWithChildren<CardLayoutProps>) {
    const t = useTranslations("auth")

    return (
        <div className={cn("w-full space-y-6", size === "sm" && "max-w-sm", size === "md" && "max-w-md", size === "lg" && "max-w-lg", size === "xl" && "max-w-4xl")}>
            <CardHeader className="text-center">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent
                className={cn(
                    "w-full"
                )}
            >
                {children}
            </CardContent>
            <CardFooter
                className={cn(
                    "border-t border-foreground/5",
                    "w-full"
                )}
            >
                <p className="text-xs text-foreground/50">{t("terms")}</p>
            </CardFooter>
        </div>
    )
}
