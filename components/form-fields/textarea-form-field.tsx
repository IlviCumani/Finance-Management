import {
    ControllerFieldState,
    ControllerRenderProps,
    FieldPath,
    FieldValues,
} from "react-hook-form"
import { Field, FieldError, FieldDescription, FieldLabel } from "../ui/field"
import { ComponentProps, PropsWithChildren } from "react"
import {
    InputGroup,
    InputGroupTextarea,
} from "../ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type TextareaFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ComponentProps<typeof Field> & {
    label: string
    placeholder?: string
    description?: string
    autoComplete?: string
    fieldState: ControllerFieldState
    field: ControllerRenderProps<TFieldValues, TName>
    isHidden?: boolean
    descriptionAsTooltip?: boolean
}

export function TextareaFormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    label,
    fieldState,
    field,
    placeholder,
    autoComplete,
    description,
    descriptionAsTooltip,
}: PropsWithChildren<TextareaFormFieldProps<TFieldValues, TName>>) {
    return (
        <Field>
            <FieldLabel>
                {label}{" "}
                <Tooltip>
                    <TooltipTrigger asChild hidden={!description || !descriptionAsTooltip}>
                        <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent align="start" side="right">{description}</TooltipContent>
                </Tooltip>
            </FieldLabel>
            <InputGroup>
                <InputGroupTextarea
                    {...field}
                    placeholder={placeholder || `${label}...`}
                    aria-invalid={fieldState.invalid}
                    autoComplete={autoComplete}
                />
            </InputGroup>
            <FieldDescription hidden={!description || descriptionAsTooltip}>
                {description}
            </FieldDescription>
            <FieldError errors={[fieldState.error]} hidden={!fieldState.invalid} />
        </Field>
    )
}
