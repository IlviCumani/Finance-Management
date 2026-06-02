import type { Metadata } from "next"
import { Geist_Mono, Nunito_Sans, Raleway } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

export const metadata: Metadata = {
  title: "FinSanctuary",
  icons: {
    icon: [
      { url: "/app-logo/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/app-logo/favicon.svg",
  },
}

import "./globals.css"
import { LocaleSync } from "@/components/locale-sync"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Confirmer } from "@/components/ui/confirmer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"

const ralewayHeading = Raleway({ subsets: ['latin'], variable: '--font-heading' });

const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()


  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", nunitoSans.variable, ralewayHeading.variable)}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleSync />
          <TooltipProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </TooltipProvider>
          <Confirmer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html >
  )
}
