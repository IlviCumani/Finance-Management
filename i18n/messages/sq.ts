import common from "./common/common-sq.json"
import auth from "./auth/auth-sq"
import validation from "./validation/validation-sq.json"
import app from "./app/app-sq.json"
import nav from "./nav/nav-sq.json"
import language from "./language/language-sq.json"
import theme from "./theme/theme-sq.json"
import userMenu from "./userMenu/userMenu-sq.json"
import pageStatus from "./pageStatus/pageStatus-sq"
import home from "./home/home-sq.json"
import accounts from "./accounts/accounts-sq"
import transactions from "./transactions/transactions-sq"
import settings from "./settings/settings-sq"
import recurringTransactions from "./recurringTransactions/recurringTransactions-sq"
import dashboard from "./dashboard/dashboard-sq"
import budgets from "./budgets/budgets-sq"

const messages = {
  common,
  auth,
  validation,
  app,
  nav,
  language,
  theme,
  userMenu,
  pageStatus,
  home,
  accounts,
  transactions,
  settings,
  recurringTransactions,
  dashboard,
  budgets,
} as const

export default messages
