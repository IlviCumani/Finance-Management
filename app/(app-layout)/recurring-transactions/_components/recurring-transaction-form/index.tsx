import { FormSheetWrapper } from "@/app/(app-layout)/_components/form-sheet-wrapper";

type RecurringTransactionFormProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RecurringTransactionForm({ open, onOpenChange }: RecurringTransactionFormProps) {
    return (
        <FormSheetWrapper
            open={open}
            onOpenChange={onOpenChange}
            title="Recurring Transaction Form"
            formId="recurring-transaction-form"
        >
            <div>
                <h1>Recurring Transaction Form</h1>
            </div>
        </FormSheetWrapper>
    )
}