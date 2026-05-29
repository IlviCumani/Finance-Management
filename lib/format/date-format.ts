import { format } from "date-fns"

export const formatDateForUI = (
  date: string | Date,
  formatModel: string = "dd MMM yyyy"
) => {
  if (!date) return "--"
  if (typeof date === "string") {
    date = new Date(date)
  }
  return format(new Date(date), formatModel)
}
