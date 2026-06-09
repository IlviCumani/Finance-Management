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
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getLogoDevUrl } from "@/lib/utils"
import { signInWithGoogle } from "@/app/auth/actions"

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
    <div
      className={cn(
        "w-full space-y-6",
        size === "sm" && "max-w-sm",
        size === "md" && "max-w-md",
        size === "lg" && "max-w-lg",
        size === "xl" && "max-w-4xl"
      )}
    >
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={cn("w-full")}>
        <div className="my-4 space-y-4">
          <Button
            variant="secondary"
            className="w-full bg-foreground font-semibold text-background"
            onClick={signInWithGoogle}
          >
            <Avatar size="sm">
              <AvatarImage src={getLogoDevUrl("google")} />
            </Avatar>
            Continue with Google
          </Button>

          <div className="flex items-center justify-center">
            <Separator className="my-4 flex-1" />
            <span className="px-2 text-foreground/50">Or</span>
            <Separator className="my-4 flex-1" />
          </div>
        </div>

        {children}
      </CardContent>
      <CardFooter className={cn("border-t border-foreground/5", "w-full")}>
        <p className="text-xs text-foreground/50">{t("terms")}</p>
      </CardFooter>
    </div>
  )
}
