import UnderDevelopment from "@/assets/storytell/under-development.svg"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

export default async function UnderConstruction() {
  const t = await getTranslations("pageStatus.underDevelopment")

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Image
        src={UnderDevelopment}
        alt={t("imageAlt")}
        className="aspect-square w-full max-w-72"
      />
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <span>HELLO THIS IS A TEST TO SEE CI?CD</span>
    </div>
  )
}
