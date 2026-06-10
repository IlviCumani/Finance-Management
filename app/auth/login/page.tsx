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
import { login } from "@/app/auth/actions"
import { InputFormField } from "@/components/form-fields/input-form-field"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "@/hooks/use-form"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const t = useTranslations("auth.login")
  const tValidation = useTranslations("validation")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const formSchema = useMemo(
    () =>
      z.object({
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
      }),
    [tValidation]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(() => true)
    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)
    const { error } = await login(formData)
    if (error) {
      setError(error)
      setIsLoading(() => false)
    } else {
      setIsLoading(() => false)
    }
  }
  const runningAt = process.env.NEXT_PUBLIC_APP_URL

  console.log("runningAt", runningAt)

  return (
    <CardLayout title={t("title")} description={t("description")}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="login-form">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
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
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
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
                    <HugeiconsIcon icon={LockPasswordIcon} />{" "}
                  </InputGroupText>
                </InputGroupAddon>
              </InputFormField>
            )}
          />
        </FieldGroup>
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <p hidden={!error} className="text-destructive">
            {error}
          </p>
          <Button
            type="submit"
            form="login-form"
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
            {t("noAccount")}{" "}
            <Link
              href="/auth/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {t("createOne")}
            </Link>
          </p>
        </div>
      </form>
    </CardLayout>
  )
}
