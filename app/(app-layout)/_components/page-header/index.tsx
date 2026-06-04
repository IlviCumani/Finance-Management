"use client"

import {
  PageHeaderBreadcrumb,
  type PageHeaderBreadcrumbLink,
} from "./breadcrumb"
import { PropsWithChildren } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

type PageHeaderProps = {
  links?: PageHeaderBreadcrumbLink[]
  title: string
  description?: string
  goBackLink?: string
}

export function PageHeader({
  links = [],
  title,
  description,
  children,
  goBackLink,
}: PropsWithChildren<PageHeaderProps>) {
  return (
    <header className="border-b bg-secondary/50 py-4">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 max-sm:flex-col max-sm:items-start">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <PageHeaderBreadcrumb
            links={links}
            title={title}
            hidden={links.length === 0}
          />
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="icon-xs"
              hidden={!goBackLink}
            >
              <Link href={goBackLink ?? ""} hidden={!goBackLink}>
                <HugeiconsIcon icon={ArrowLeftIcon} size={16} />
              </Link>
            </Button>
            <div className="flex flex-col gap-2">
              <h2>{title}</h2>
              {description ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="w-full text-sm text-muted-foreground/80 sm:truncate">
                      {description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>
        </div>
        {children}
      </div>
    </header>
  )
}
