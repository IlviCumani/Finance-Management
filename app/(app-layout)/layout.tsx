import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "./_components/app-sidebar"
import { AppHeader } from "./_components/app-header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-x-hidden">
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
