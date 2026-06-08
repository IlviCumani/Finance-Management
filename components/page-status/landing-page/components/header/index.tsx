"use client"

import CardNav, {
  CardNavItem,
} from "@/components/page-status/landing-page/components/ui/card-nav"

const LOGO_URL = "/app-logo/favicon.svg"

export function Header() {
  const items: CardNavItem[] = [
    {
      label: "Features",
      bgColor: "var(--muted)",
      textColor: "var(--foreground)",
      links: [
        {
          label: "Dashboard",
          ariaLabel: "Dashboard overview",
          href: "#dashboard",
        },
        {
          label: "Transactions",
          ariaLabel: "Transaction tracking",
          href: "#transactions",
        },
        {
          label: "Recurring Payments",
          ariaLabel: "Recurring payments",
          href: "#recurring",
        },
      ],
    },
    {
      label: "Product",
      bgColor: "var(--muted)",
      textColor: "var(--foreground)",
      links: [
        {
          label: "Accounts",
          ariaLabel: "Multi-account management",
          href: "#accounts",
        },
        {
          label: "Categories",
          ariaLabel: "Smart categorization",
          href: "#categories",
        },
        { label: "Roadmap", ariaLabel: "Product roadmap", href: "#roadmap" },
      ],
    },
    {
      label: "More",
      bgColor: "var(--muted)",
      textColor: "var(--foreground)",
      links: [
        { label: "About", ariaLabel: "About the project", href: "#about" },
        {
          label: "Testimonials",
          ariaLabel: "What users say",
          href: "#testimonials",
        },
      ],
    },
  ]
  return (
    <CardNav
      logo={LOGO_URL}
      logoAlt="Company Logo"
      items={items}
      baseColor="var(--background)"
      className="fixed top-0 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-primary"
      menuColor="var(--foreground)"
      buttonBgColor="var(--primary)"
      buttonTextColor="var(--primary-foreground)"
      ease="power3.out"
    />
  )
}
