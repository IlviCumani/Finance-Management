import { SidebarTrigger } from "@/components/ui/sidebar"
import { LanguageSelect } from "./language-select"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
    return <header className="sticky top-0 z-40 border-b bg-secondary rounded-t-lg">
        <div className=" mx-auto flex h-16 items-center px-4 justify-between">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <LanguageSelect />
                <ThemeToggle />
            </div>
        </div>
    </header>
}