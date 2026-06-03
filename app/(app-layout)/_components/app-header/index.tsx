import { AppSidebarTrigger } from "./sidebar-trigger"
import { LanguageSelect } from "./language-select"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 rounded-t-lg border-b bg-secondary">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <AppSidebarTrigger />
        <div className="flex items-center gap-2">
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
