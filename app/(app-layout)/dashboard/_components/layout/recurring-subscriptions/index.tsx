import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getLogoDevUrl } from "@/lib/utils"
import { getInitials } from "@/lib/format/text-format"
import { formatCurrency } from "@/lib/format/number-format"
import {
  Empty,
  EmptyDescription,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { InboxIcon, LinkSquare01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

type RecurringSubscriptionsProps = {
  subscriptions: Array<{ name: string; amount: number }>
  totalCost: number
}

export async function RecurringSubscriptions({
  subscriptions,
  totalCost,
}: RecurringSubscriptionsProps) {
  const t = await getTranslations("dashboard.recurringSubscriptions")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="h-full max-h-[450px] space-y-2 overflow-y-auto">
        {subscriptions.length === 0 ? (
          <Empty className="h-full items-center justify-center">
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <HugeiconsIcon icon={InboxIcon} className="size-4" />
              </EmptyMedia>
              <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
              <Button asChild>
                <Link href="/recurring-transactions">
                  <HugeiconsIcon icon={LinkSquare01Icon} />
                  {t("goToRecurring")}
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          subscriptions.map((item) => (
            <Item key={item.name} variant={"muted"}>
              <ItemMedia>
                <Avatar className="size-10">
                  <AvatarImage src={getLogoDevUrl(item.name)} alt={item.name} />
                  <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                </Avatar>
                <ItemTitle>{item.name}</ItemTitle>
              </ItemMedia>

              <ItemContent className="items-end justify-end text-right">
                <ItemDescription>
                  {formatCurrency(item.amount)}
                  {t("perMonth")}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))
        )}
      </CardContent>
      <CardFooter className="mt-auto items-center justify-between border-t">
        <span className="text-sm text-muted-foreground">
          {t("totalMonthly")}
        </span>
        <span className="text-lg font-medium">{formatCurrency(totalCost)}</span>
      </CardFooter>
    </Card>
  )
}
