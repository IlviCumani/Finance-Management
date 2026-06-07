"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { PropsWithChildren } from "react"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"

type FormSheetWrapperProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  formId: string
  error?: string | null
  isLoading?: boolean
}

export function FormSheetWrapper({
  children,
  open,
  onOpenChange,
  title,
  description,
  formId,
  error,
  isLoading,
}: PropsWithChildren<FormSheetWrapperProps>) {
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
        <div className="p-4">{children}</div>
        <SheetFooter className="bg-secondary">
          <p className="text-center text-destructive" hidden={!error}>
            {error}
          </p>
          <Button type="submit" form={formId} disabled={isLoading}>
            <Spinner
              data-hidden={!isLoading}
              className="data-[hidden=true]:hidden"
            />
            {t("save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
