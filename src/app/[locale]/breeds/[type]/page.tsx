import { loadBreeds } from "@/lib/breeds"
import { PetType } from "@/types/breed"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import BreedListClient from "./BreedListClient"

export function generateStaticParams() {
  return [
    { type: "dog", locale: "en" }, { type: "dog", locale: "zh" },
    { type: "cat", locale: "en" }, { type: "cat", locale: "zh" },
  ]
}

export default async function BreedListPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>
}) {
  const { locale, type } = await params
  if (type !== "dog" && type !== "cat") notFound()
  const t = await getTranslations("breeds")
  const breeds = loadBreeds(type as PetType)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900">{type === "dog" ? t("dogs") : t("cats")}</h1>
      <p className="mt-2 text-stone-500">{t("breedCount", { count: breeds.length })}</p>
      <BreedListClient
        breeds={breeds}
        locale={locale}
        type={type as PetType}
        searchPlaceholder={t("searchPlaceholder")}
        noResults={t("noResults")}
      />
    </div>
  )
}