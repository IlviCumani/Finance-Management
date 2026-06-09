"use client"

import type { ReactNode, MouseEvent } from "react"
import { handleSectionLinkClick } from "@/components/page-status/landing-page/lib/scroll-to-section"

type SectionLinkProps = {
  href: string
  children: ReactNode
}

export function SectionLink({ href, children }: SectionLinkProps) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    handleSectionLinkClick(event, href)
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="transition-colors hover:text-foreground"
    >
      {children}
    </a>
  )
}
