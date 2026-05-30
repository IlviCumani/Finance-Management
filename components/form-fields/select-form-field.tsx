import { Field, FieldError, FieldDescription, FieldLabel } from "../ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectScrollUpButton, SelectScrollDownButton } from "../ui/select"
import { ControllerRenderProps, ControllerFieldState, FieldPath, FieldValues } from "react-hook-form"
import { ComponentProps } from "react"
import { Tooltip, TooltipTrigger } from "../ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

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
    ...props
}: SelectFormFieldProps<TFieldValues, TName>) {
    return (
        <Field data-invalid={fieldState.invalid} {...props}>
            <FieldLabel>
                {label}{" "}
                <Tooltip>
                    <TooltipTrigger asChild hidden={!description || !descriptionAsTooltip}>
                        <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
                    </TooltipTrigger>
                </Tooltip>
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder || `${label}...`} />
                </SelectTrigger>
                <SelectContent className="max-h-60" position={position}>
                    <SelectScrollUpButton />
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