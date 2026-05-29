"use client"

import { Field, FieldError, FieldDescription, FieldLabel } from "../ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "../ui/input-group"
import type { PropsWithChildren, ComponentProps } from "react"
import { useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../ui/tooltip"
import { InformationCircleIcon, EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type {
    ControllerFieldState,
    ControllerRenderProps,
    FieldPath,
    FieldValues,
} from "react-hook-form"
// import { EyeIcon, EyeOffIcon } from "lucide-react"

type InputFormFieldProps<
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

export function InputFormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    label,
    placeholder,
    description,
    autoComplete = "off",
    fieldState,
    field,
    children,
    isHidden = false,
    descriptionAsTooltip = false,
    ...props
}: PropsWithChildren<InputFormFieldProps<TFieldValues, TName>>) {
    const [hideText, setHideText] = useState(isHidden)
    return (
        <Field data-invalid={fieldState.invalid} {...props}>
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
                <InputGroupInput
                    {...field}
                    placeholder={placeholder || `${label}...`}
                    aria-invalid={fieldState.invalid}
                    autoComplete={autoComplete}
                    type={hideText ? "password" : "text"}
                />
                {children}
                <InputGroupAddon align="inline-end" hidden={!isHidden}>
                    <InputGroupButton
                        type="button"
                        onClick={() => setHideText((prev) => !prev)}
                    >
                        {hideText ? <HugeiconsIcon icon={EyeIcon} /> : <HugeiconsIcon icon={EyeOffIcon} />}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
            <FieldDescription hidden={!description || descriptionAsTooltip}>
                {description}
            </FieldDescription>
            <FieldError errors={[fieldState.error]} hidden={!fieldState.invalid} />
        </Field>
    )
}
