"use client"

import { Button } from "@/components/ui/button"
import CardLayout from "../_components/card-layout"
import { FieldGroup } from "@/components/ui/field"
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockPasswordIcon, MailIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Controller } from "react-hook-form"
import * as z from "zod"
import { register } from "@/app/auth/actions"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "@/hooks/use-form"
import { Spinner } from "@/components/ui/spinner"

export default function RegisterPage() {
  const t = useTranslations("auth.register")
  const tValidation = useTranslations("validation")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const formSchema = useMemo(
    () =>
      z
        .object({
          fullName: z.string().min(1, tValidation("fullNameRequired")),
          email: z.string().email(tValidation("emailInvalid")),
          password: z
            .string()
            .min(8, tValidation("passwordMinLength"))
            .regex(/[A-Z]/, {
              message: tValidation("passwordUppercase"),
            })
            .regex(/\d/, {
              message: tValidation("passwordNumber"),
            })
            .regex(/[a-z]/, {
              message: tValidation("passwordLowercase"),
            })
            .regex(/[!@#$%^&*]/, {
              message: tValidation("passwordSpecial"),
            }),
          confirmPassword: z.string().min(8, tValidation("passwordMinLength")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          path: ["confirmPassword"],
          message: tValidation("passwordsDoNotMatch"),
        }),
    [tValidation]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(() => true)
    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)
    formData.append("fullName", values.fullName)
    const { error } = await register(formData)
    if (error) {
      setError(error)
    }
    setIsLoading(() => false)
  }

  return (
    <CardLayout title={t("title")} description={t("description")} size="xl">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="register-form"
        className="sm:w-full md:w-2xl"
      >
        <FieldGroup className="grid w-full grid-cols-1 gap-4 space-y-4 md:grid-cols-2">
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <InputFormField
                  label={t("fullName")}
                  placeholder={t("fullNamePlaceholder")}
                  description={t("fullNameDescription")}
                  fieldState={fieldState}
                  field={field}
                ></InputFormField>
              )
            }}
          ></Controller>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <InputFormField
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  description={t("emailDescription")}
                  fieldState={fieldState}
                  field={field}
                >
                  <InputGroupAddon>
                    <InputGroupText>
                      <HugeiconsIcon icon={MailIcon} />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputFormField>
              )
            }}
          ></Controller>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <InputFormField
                  label={t("password")}
                  placeholder={t("passwordPlaceholder")}
                  description={t("passwordDescription")}
                  fieldState={fieldState}
                  field={field}
                  isHidden
                >
                  <InputGroupAddon>
                    <InputGroupText>
                      <HugeiconsIcon icon={LockPasswordIcon} />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputFormField>
              )
            }}
          ></Controller>
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <InputFormField
                  label={t("confirmPassword")}
                  placeholder={t("confirmPasswordPlaceholder")}
                  description={t("confirmPasswordDescription")}
                  fieldState={fieldState}
                  field={field}
                  isHidden
                >
                  <InputGroupAddon>
                    <InputGroupText>
                      <HugeiconsIcon icon={LockPasswordIcon} />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputFormField>
              )
            }}
          ></Controller>
        </FieldGroup>
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <p hidden={!error} className="text-destructive">
            {error}
          </p>

          <Button
            type="submit"
            form="register-form"
            className="w-full"
            disabled={isLoading}
          >
            <Spinner
              data-hidden={!isLoading}
              className="data-[hidden=true]:hidden"
            />
            {t("submit")}
          </Button>

          <p className="text-center text-sm text-foreground/70">
            {t("hasAccount")}{" "}
            <Link
              href="/auth/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {t("signIn")}
            </Link>
          </p>
        </div>
      </form>
    </CardLayout>
  )
}
