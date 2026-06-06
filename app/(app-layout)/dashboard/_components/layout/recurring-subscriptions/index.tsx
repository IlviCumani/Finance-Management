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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getLogoDevUrl } from "@/lib/utils"
import { getInitials } from "@/lib/format/text-format"
import { formatCurrency } from "@/lib/format/number-format"
export function RecurringSubscriptions() {
  const data = [
    { name: "Netflix", amount: 100 },
    { name: "Spotify", amount: 200 },
    { name: "Amazon Prime", amount: 300 },
    { name: "Disney+", amount: 400 },
    { name: "Hulu", amount: 500 },
    { name: "Cursor", amount: 600 },
    { name: "Google Workspace", amount: 700 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Subscriptions</CardTitle>
        <CardDescription>
          Recurring subscriptions over the last 3 months
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full max-h-[450px] space-y-2 overflow-y-auto">
        {data.map((item) => (
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
                {formatCurrency(item.amount)}/mo
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </CardContent>
      <CardFooter className="mt-auto items-center justify-between border-t">
        <span className="text-sm text-muted-foreground">Total: Monthly</span>
        <span className="text-lg font-medium">
          {formatCurrency(data.reduce((acc, item) => acc + item.amount, 0))}
        </span>
      </CardFooter>
    </Card>
  )
}
