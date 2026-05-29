import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getTranslations } from "next-intl/server"
import { NavUser } from "./user-dropdown"
import { NavMain } from "./nav-menu"
import { getLoggedUserProfile } from "@/lib/supabase/queries/user-profile"

type AppSidebarProps = React.ComponentProps<typeof Sidebar>

export default async function AppSidebar({ ...props }: AppSidebarProps) {
    const { loggedUserDetails, user } = await getLoggedUserProfile()
    const t = await getTranslations("app")

    return <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        className="data-[slot=sidebar-menu-button]:p-1.5!"
                    >
                        <span className="text-base font-semibold">
                            {/* <VideoIcon className="h-4 w-4" /> */}
                            {t("title")}
                        </span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <NavMain />
        </SidebarContent>
        <SidebarFooter>
            <NavUser user={{
                name: loggedUserDetails?.full_name,
                email: user.email,
                avatar: loggedUserDetails?.avatar_url,
            }} />
        </SidebarFooter>
    </Sidebar>
}