import common from "./common/common-en.json"
import auth from "./auth/auth-en"
import validation from "./validation/validation-en.json"
import app from "./app/app-en.json"
import nav from "./nav/nav-en.json"
import language from "./language/language-en.json"
import theme from "./theme/theme-en.json"
import userMenu from "./userMenu/userMenu-en.json"
import pageStatus from "./pageStatus/pageStatus-en"
import home from "./home/home-en.json"
import accounts from "./accounts/accounts-en"
import transactions from "./transactions/transactions-en"
import settings from "./settings/settings-en"
import recurringTransactions from "./recurringTransactions/recurringTransactions-en"

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
} as const

export default messages
