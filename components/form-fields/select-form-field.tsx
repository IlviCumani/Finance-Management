"use client"

import { Field, FieldError, FieldDescription, FieldLabel } from "../ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "../ui/select"
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
  Empty,
  EmptyTitle,
  EmptyHeader,
  EmptyDescription,
  EmptyContent,
} from "../ui/empty"
import Link from "next/link"
import { Button } from "../ui/button"

type SelectFormFieldProps<
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
  addOptionUrl?: string
  position?: "popper" | "item-aligned"
}

export function SelectFormField<
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
  position = "popper",
  addOptionUrl,
  ...props
}: SelectFormFieldProps<TFieldValues, TName>) {
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
        </Tooltip>
      </FieldLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger
          aria-invalid={fieldState.invalid || undefined}
          className={cn(
            "w-full",
            fieldState.invalid &&
              "border-destructive ring-3 ring-destructive/20 dark:ring-destructive/40"
          )}
        >
          <SelectValue placeholder={placeholder || `${label}...`} />
        </SelectTrigger>
        <SelectContent className="max-h-60" position={position}>
          <SelectScrollUpButton />
          <Empty hidden={options.length > 0}>
            <EmptyHeader>
              <EmptyTitle>No options found</EmptyTitle>
              <EmptyDescription>No options found</EmptyDescription>
            </EmptyHeader>
            <EmptyContent hidden={!addOptionUrl}>
              <Link href={addOptionUrl ?? ""}>
                <Button variant="outline">Add option</Button>
              </Link>
            </EmptyContent>
          </Empty>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          <SelectScrollDownButton />
        </SelectContent>
      </Select>
      <FieldDescription hidden={!description || descriptionAsTooltip}>
        {description}
      </FieldDescription>
      <FieldError errors={[fieldState.error]} hidden={!fieldState.invalid} />
    </Field>
  )
}
