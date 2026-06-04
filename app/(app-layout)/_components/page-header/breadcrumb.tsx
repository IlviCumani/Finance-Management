import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChevronRightIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { Fragment } from "react"

export type PageHeaderBreadcrumbLink = {
  label: string
  href: string
}

export type PageHeaderBreadcrumbProps = {
  links: PageHeaderBreadcrumbLink[]
  title: string
  hidden?: boolean
}

type BreadcrumbSegment =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; links: PageHeaderBreadcrumbLink[] }
  | { type: "title"; label: string }

function buildBreadcrumbSegments(
  links: PageHeaderBreadcrumbLink[],
  title: string
): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = []

  if (links.length > 3) {
    segments.push({ type: "link", ...links[0] })
    const middleLinks = links.slice(1, -1)
    if (middleLinks.length > 0) {
      segments.push({ type: "dropdown", links: middleLinks })
    }
    segments.push({ type: "link", ...links[links.length - 1] })
  } else {
    for (const link of links) {
      segments.push({ type: "link", ...link })
    }
  }

  segments.push({ type: "title", label: title })
  return segments
}

function getSegmentKey(segment: BreadcrumbSegment, index: number) {
  if (segment.type === "link") {
    return segment.href
  }
  if (segment.type === "dropdown") {
    return segment.links.map((link) => link.href).join("-")
  }
  return `title-${segment.label}-${index}`
}

function BreadcrumbSeparatorItem() {
  return (
    <BreadcrumbSeparator>
      <HugeiconsIcon icon={ChevronRightIcon} size={16} />
    </BreadcrumbSeparator>
  )
}

function BreadcrumbLinkItem({ label, href }: { label: string; href: string }) {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href={href}>{label}</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

function BreadcrumbDropdownItem({
  links,
}: {
  links: PageHeaderBreadcrumbLink[]
}) {
  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-5 items-center justify-center">
          <BreadcrumbEllipsis />
          <span className="sr-only">Toggle menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {links.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
}

export function PageHeaderBreadcrumb({
  links,
  title,
  hidden,
}: PageHeaderBreadcrumbProps) {
  const segments = buildBreadcrumbSegments(links, title)

  return (
    <Breadcrumb hidden={hidden}>
      <BreadcrumbList className="text-xs" hidden={hidden}>
        {segments.map((segment, index) => (
          <Fragment key={getSegmentKey(segment, index)}>
            {index > 0 ? <BreadcrumbSeparatorItem /> : null}
            {segment.type === "link" ? (
              <BreadcrumbLinkItem label={segment.label} href={segment.href} />
            ) : null}
            {segment.type === "dropdown" ? (
              <BreadcrumbDropdownItem links={segment.links} />
            ) : null}
            {segment.type === "title" ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
