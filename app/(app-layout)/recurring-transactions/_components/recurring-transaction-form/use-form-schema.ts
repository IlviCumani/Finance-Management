import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { startOfDay } from "date-fns"
import * as z from "zod"

export function useRecurringTransactionFormSchema() {
  const tValidation = useTranslations("recurringTransactions.validation")

  const formSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, tValidation("nameRequired")),
          description: z.string().min(1, tValidation("descriptionRequired")),
          amount: z
            .string()
            .min(1, tValidation("amountRequired"))
            .regex(/^\d+$/, tValidation("amountWholeNumber")),
          frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
          accountId: z.string().min(1, tValidation("accountRequired")),
          paymentDate: z.date(),
        })
        .refine(
          (data) => startOfDay(data.paymentDate) >= startOfDay(new Date()),
          {
            path: ["paymentDate"],
            message: tValidation("paymentDateFuture"),
          }
        )
        .refine((data) => Number(data.amount) > 0, {
          path: ["amount"],
          message: tValidation("amountMin"),
        }),
    [tValidation]
  )

  return formSchema
}
