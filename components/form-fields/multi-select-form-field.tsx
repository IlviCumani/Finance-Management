"use client"

import { Field, FieldError, FieldDescription, FieldLabel } from "../ui/field"
import { cn } from "@/lib/utils"
import {
  ControllerRenderProps,
  ControllerFieldState,
  FieldPath,
  FieldValues,
} from "react-hook-form"
import { ComponentProps } from "react"
import { Tooltip, TooltipTrigger } from "../ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multi-select"

type MultiSelectFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ComponentProps<typeof Field> & {
  label: string
  placeholder?: string
  description?: string
  fieldState: ControllerFieldState
  field: ControllerRenderProps<TFieldValues, TName>
  descriptionAsTooltip?: boolean
  options: Array<{
    label: string
    value: string
  }>
}

export function MultiSelectFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  description,
  fieldState,
  field,
  descriptionAsTooltip = false,
  options,
  ...props
}: MultiSelectFormFieldProps<TFieldValues, TName>) {
  const selectedValues = Array.isArray(field.value)
    ? (field.value as Array<string>)
    : []

  return (
    <Field data-invalid={fieldState.invalid} {...props}>
      <FieldLabel>
        {label}{" "}
        <Tooltip>
          <TooltipTrigger
            asChild
            hidden={!description || !descriptionAsTooltip}
          >
            <HugeiconsIcon icon={InformationCircleIcon} className="size-4" />
          </TooltipTrigger>
        </Tooltip>
      </FieldLabel>
      <MultiSelector
        values={selectedValues}
        onValuesChange={field.onChange}
        options={options}
      >
        <MultiSelectorTrigger
          aria-invalid={fieldState.invalid || undefined}
          className={cn(
            "w-full",
            fieldState.invalid &&
              "border-destructive ring-3 ring-destructive/20 dark:ring-destructive/40"
          )}
        >
          <MultiSelectorInput placeholder={placeholder || `${label}...`} />
        </MultiSelectorTrigger>
        <MultiSelectorContent>
          <MultiSelectorList>
            {options.map((option) => (
              <MultiSelectorItem key={option.value} value={option.value}>
                {option.label}
              </MultiSelectorItem>
            ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
      <FieldDescription hidden={!description || descriptionAsTooltip}>
        {description}
      </FieldDescription>
      <FieldError errors={[fieldState.error]} hidden={!fieldState.invalid} />
    </Field>
  )
}
