import { Button } from "@/components/ui/button"
import { requireUser } from "@/lib/require-user"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"

export default async function Page() {
  const user = await requireUser()

  if (user) {
    redirect("/dashboard")
  }

  const t = await getTranslations("home")

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">{t("title")}</h1>
          <p>{t("description1")}</p>
          <p>{t("description2")}</p>
          <Button className="mt-2">{t("button")}</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          ({t("darkModeHint", { key: "d" })})
        </div>
      </div>
    </div>
  )
}
