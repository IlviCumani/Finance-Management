"use client"

import { Field, FieldError, FieldDescription, FieldLabel } from "../ui/field"
import {
  DatePicker,
  DatePickerTrigger,
  DatePickerValue,
  DatePickerContent,
  DatePickerCalendar,
} from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import type { PropsWithChildren, ComponentProps } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form"
// import { EyeIcon, EyeOffIcon } from "lucide-react"

type DateFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ComponentProps<typeof Field> & {
  label: string
  placeholder?: string
  description?: string
  fieldState: ControllerFieldState
  field: ControllerRenderProps<TFieldValues, TName>
  descriptionAsTooltip?: boolean
  mode?: React.ComponentProps<typeof DatePicker>["mode"]
}

export function DateFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  description,
  fieldState,
  field,
  descriptionAsTooltip = false,
  mode = "single",
  ...props
}: PropsWithChildren<DateFormFieldProps<TFieldValues, TName>>) {
  return (
    <Field data-invalid={fieldState.invalid} {...props}>
      <FieldLabel>
        {label}{" "}
        <Tooltip>
          <TooltipTrigger
            asChild
            hidden={!description || !descriptionAsTooltip}
          >
            <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent align="start" side="right">
            {description}
          </TooltipContent>
        </Tooltip>
      </FieldLabel>
      <DatePicker
        mode={mode}
        value={field.value}
        onValueChange={field.onChange}
        required={false}
      >
        <DatePickerTrigger
          aria-invalid={fieldState.invalid || undefined}
          className={cn(
            "h-fit bg-input/50!",
            fieldState.invalid
              ? "border-destructive ring-3 ring-destructive/20 dark:ring-destructive/40"
              : "border-none!"
          )}
        >
          <DatePickerValue
            placeholder={placeholder || `${label}...`}
            className="text-wrap"
          ></DatePickerValue>
        </DatePickerTrigger>
        <DatePickerContent>
          <DatePickerCalendar captionLayout="dropdown" />
        </DatePickerContent>
      </DatePicker>
      <FieldDescription hidden={!description || descriptionAsTooltip}>
        {description}
      </FieldDescription>
      <FieldError errors={[fieldState.error]} hidden={!fieldState.invalid} />
    </Field>
  )
}
