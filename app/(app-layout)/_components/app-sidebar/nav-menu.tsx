"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
    SidebarMenuSub,
} from "@/components/ui/sidebar"
import { getNavItems, NavItem } from "./get-nav-items"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { ChevronRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"


export function NavMain() {
    const pathname = usePathname()
    const t = useTranslations()
    const navItems = getNavItems()
    const { open, isMobile, } = useSidebar();

    const Wrapper = open || isMobile ? {
        Wrapper: Collapsible,
        Trigger: CollapsibleTrigger,
        Content: CollapsibleContent,
    } : {
        Wrapper: DropdownMenu,
        Trigger: DropdownMenuTrigger,
        Content: DropdownMenuContent,
    }

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {(navItems || []).map((item) => {
                        const isActive =
                            pathname === item.url ||
                            pathname.startsWith(`${item.url}/`)
                        const title = t(item.titleKey)

                        if (item.items) {
                            return (
                                <Wrapper.Wrapper key={item.url} className="group/collapsible">
                                    <Wrapper.Trigger asChild>
                                        <SidebarMenuButton isActive={isActive} className={cn(
                                            isActive &&
                                            "data-active:bg-primary data-active:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        )}>
                                            {item.icon && <HugeiconsIcon icon={item.icon} />}
                                            <span>{title}</span>
                                            <HugeiconsIcon icon={ChevronRightIcon} className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </Wrapper.Trigger>
                                    <SidebarMenuSub className="mr-0 pr-0">
                                        <Wrapper.Content>
                                            <SidebarMenuItem>
                                                {!open && !isMobile && (
                                                    <>
                                                        <DropdownMenuLabel className="flex items-center gap-2 ">
                                                            {item.icon && <HugeiconsIcon icon={item.icon} className="size-4" />}
                                                            {title}
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                                {item.items.map((_item: NavItem) => {
                                                    const isActive =
                                                        pathname === _item.url ||
                                                        pathname.startsWith(`${_item.url}/`)
                                                    const subTitle = t(_item.titleKey)
                                                    return (
                                                        <SidebarMenuButton key={
                                                            _item.url
                                                        } asChild tooltip={subTitle} isActive={isActive} className={cn(
                                                            isActive &&
                                                            "data-active:bg-primary/60 data-active:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                                        )}>
                                                            <Link href={_item.url}>
                                                                {_item.icon && <HugeiconsIcon icon={_item.icon} />}
                                                                <span>{subTitle}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    )
                                                })}
                                            </SidebarMenuItem>

                                        </Wrapper.Content>
                                    </SidebarMenuSub>
                                </Wrapper.Wrapper>
                            )
                        }

                        return (
                            <SidebarMenuItem key={item.url} className="">
                                <SidebarMenuButton
                                    asChild
                                    tooltip={title}
                                    isActive={isActive}
                                    className={cn(
                                        isActive &&
                                        "data-active:bg-primary data-active:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                    )}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <HugeiconsIcon icon={item.icon} />}
                                        <span>{title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
