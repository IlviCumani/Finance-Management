import {
  FieldValues,
  UseFormProps,
  useForm as useReactHookForm,
} from "react-hook-form"

export function useForm<TFormValues extends FieldValues = FieldValues>(
  options: UseFormProps<TFormValues>
) {
  const form = useReactHookForm<TFormValues>({
    ...options,
    mode: "onTouched",
  })

  return form
}
