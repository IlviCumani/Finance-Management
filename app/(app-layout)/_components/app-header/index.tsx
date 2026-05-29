import { AppSidebarTrigger } from "./sidebar-trigger"
import { LanguageSelect } from "./language-select"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
    return <header className="sticky top-0 z-40 border-b bg-secondary rounded-t-lg">
        <div className=" mx-auto flex h-16 items-center px-4 justify-between">
            <AppSidebarTrigger />
            <div className="flex items-center gap-2">
                <LanguageSelect />
                <ThemeToggle />
            </div>
        </div>
    </header>
}