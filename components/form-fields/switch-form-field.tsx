import { Field, FieldError, FieldDescription, FieldLabel } from "../ui/field"
import { Switch } from "../ui/switch"
import { ControllerRenderProps, ControllerFieldState, FieldPath, FieldValues } from "react-hook-form"
import { ComponentProps } from "react"
import { Tooltip, TooltipTrigger } from "../ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

type SwitchFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ComponentProps<typeof Field> & {
    label: string
    description?: string
    fieldState: ControllerFieldState
    field: ControllerRenderProps<TFieldValues, TName>
    descriptionAsTooltip?: boolean
}

export function SwitchFormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ label, description, fieldState, field, descriptionAsTooltip = false, ...props }: SwitchFormFieldProps<TFieldValues, TName>) {
    return (
        <Field data-invalid={fieldState.invalid} {...props}>
            <div className="flex items-center gap-2 justify-between">
                <FieldLabel>
                    {label}{" "}
                    <Tooltip>
                        <TooltipTrigger asChild hidden={!description || !descriptionAsTooltip}>
                            <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
                        </TooltipTrigger>
                    </Tooltip>
                </FieldLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
            <FieldDescription hidden={!description || descriptionAsTooltip}>
                {description}
            </FieldDescription>
            <FieldError errors={[fieldState.error]} hidden={!fieldState.invalid} />
        </Field>
    )
}