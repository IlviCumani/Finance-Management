export function formatCurrency(amount: number, currency: string = "ALL") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(Math.abs(amount))
}

//rounds the number to 2 decimal places
export function formatNumberForUI(number: number): number {
  return Math.round(number * 100) / 100
}
