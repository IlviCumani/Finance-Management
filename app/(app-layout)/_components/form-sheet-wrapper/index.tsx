"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";

type FormSheetWrapperProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    formId: string
    error?: string | null
}

export function FormSheetWrapper({ children, open, onOpenChange, title, description, formId, error }: PropsWithChildren<FormSheetWrapperProps>) {
    const t = useTranslations("common")

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription hidden={!description}>
                        {description}
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    {children}
                </div>
                <SheetFooter className="bg-secondary">
                    <p className="text-destructive text-center" hidden={!error}>{error}</p>
                    <Button type="submit" form={formId}>
                        {t("save")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
