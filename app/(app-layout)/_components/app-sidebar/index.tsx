import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./user-dropdown"
import { NavMain } from "./nav-menu"
import { getLoggedUserProfile } from "@/lib/supabase/queries/user-profile"
import { LogoSvg } from "@/components/svg/app-logo/logo"

type AppSidebarProps = React.ComponentProps<typeof Sidebar>

export default async function AppSidebar({ ...props }: AppSidebarProps) {
  const { loggedUserDetails, user } = await getLoggedUserProfile()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="FinSanctuary"
              className="group-data-[collapsible=icon]:justify-center [&_svg]:size-8!"
            >
              <LogoSvg size={32} />
              <span className="truncate text-lg font-bold group-data-[collapsible=icon]:hidden">
                FinSanctuary
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: loggedUserDetails?.full_name,
            email: user.email,
            avatar: loggedUserDetails?.avatar_url,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
