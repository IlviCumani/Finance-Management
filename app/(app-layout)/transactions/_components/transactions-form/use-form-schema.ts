import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { startOfDay } from "date-fns"
import * as z from "zod"

export function useTransactionFormSchema() {
  const tValidation = useTranslations("transactions.validation")

  const formSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, tValidation("nameRequired")),
          amount: z
            .string()
            .min(1, tValidation("amountRequired"))
            .regex(/^\d+$/, tValidation("amountWholeNumber")),
          accountId: z.string().min(1, tValidation("accountRequired")),
          toAccountId: z.string().optional().nullable(),
          description: z.string(),
          transactionCategoryId: z
            .string()
            .min(1, tValidation("transactionCategoryRequired")),
          transactionDate: z.date({
            error: tValidation("transactionDateRequired"),
          }),
        })
        .refine(
          (data) => startOfDay(data.transactionDate) <= startOfDay(new Date()),
          {
            path: ["transactionDate"],
            message: tValidation("transactionDateFuture"),
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
