import type { MouseEvent } from "react"

const HEADER_OFFSET = 88

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (!element) return

  const top =
    element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET

  window.scrollTo({ top, behavior: "smooth" })
}

export function handleSectionLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string
) {
  if (!href.startsWith("#") || href.length < 2) return

  event.preventDefault()
  scrollToSection(href.slice(1))
}
