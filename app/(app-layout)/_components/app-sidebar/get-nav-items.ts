import {
  HugeiconsIcon,
  HomeIcon,
  PiggyBankIcon,
  Wallet01Icon,
  ChartAnalysisIcon,
  LandmarkIcon,
  Settings02Icon,
  User03Icon,
  BellRingIcon,
  LaptopVideoIcon,
  Settings05Icon,
  SecurityLockIcon,
  Invoice04Icon,
  ListXIcon,
} from "@hugeicons/core-free-icons"

export type NavItem = {
  titleKey: string
  url: string
  icon?: typeof HugeiconsIcon
  items?: NavItem[]
}

export function getNavItems(): NavItem[] {
  return [
    {
      titleKey: "nav.dashboard",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      titleKey: "nav.transactions",
      url: "/transactions",
      icon: Invoice04Icon,
    },
    {
      titleKey: "nav.accounts",
      url: "/accounts",
      icon: LandmarkIcon,
    },
    {
      titleKey: "nav.budgets",
      url: "/budgets",
      icon: Wallet01Icon,
    },
    {
      titleKey: "nav.savings",
      url: "/savings",
      icon: PiggyBankIcon,
    },
    {
      titleKey: "nav.recurringTransactions",
      url: "/recurring-transactions",
      icon: LaptopVideoIcon,
    },
    {
      titleKey: "nav.analytics",
      url: "/analytics",
      icon: ChartAnalysisIcon,
    },
    {
      titleKey: "nav.settings",
      url: "/settings",
      icon: Settings02Icon,
      items: [
        {
          titleKey: "nav.profile",
          url: "/settings/profile",
          icon: User03Icon,
        },
        {
          titleKey: "nav.transactionCategories",
          url: "/settings/transaction-categories",
          icon: ListXIcon,
        },
        {
          titleKey: "nav.preferences",
          url: "/settings/preferences",
          icon: Settings05Icon,
        },
        {
          titleKey: "nav.security",
          url: "/settings/security",
          icon: SecurityLockIcon,
        },
        {
          titleKey: "nav.notifications",
          url: "/settings/notifications",
          icon: BellRingIcon,
        },
      ],
    },
  ]
}
