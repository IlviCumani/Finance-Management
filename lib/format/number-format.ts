export function formatCurrency(amount: number, currency: string = "ALL") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(Math.abs(amount))
}
