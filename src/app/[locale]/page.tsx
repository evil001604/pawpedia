import { getTranslations } from "next-intl/server"
import { loadBreed, loadBreeds } from "@/lib/breeds"
import Link from "next/link"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = locale as "en" | "zh"
  const title = l === "en" ? "PetPedia — AI Pet Breed Encyclopedia" : "PetPedia — AI宠物品种百科"
  const description = l === "en"
    ? "Explore 266+ dog and cat breeds with radar charts, health guides, AI diagnosis, and product picks. Bilingual EN/ZH."
    : "探索266+犬猫品种，包含雷达图、健康指南、AI诊断和用品推荐。中英双语。"
  return {
    title,
    description,
    openGraph: { title, description },
  }
}

const features = [
  { key: "traits", color: "bg-amber-50 border-amber-200" },
  { key: "health", color: "bg-emerald-50 border-emerald-200" },
  { key: "diagnosis", color: "bg-blue-50 border-blue-200" },
  { key: "products", color: "bg-purple-50 border-purple-200" },
] as const

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("home")
  const dogs = loadBreeds("dog")
  const cats = loadBreeds("cat")

  const featuredDogIds = ["border-collie", "alaskan-husky", "bulldog", "beagle"]
  const featuredDogs = featuredDogIds.map(id => loadBreed("dog", id)!).filter(b => b !== null)
  const featuredCatIds = ["persian", "siamese", "maine-coon", "ragdoll"]
  const featuredCats = featuredCatIds.map(id => loadBreed("cat", id)!).filter(b => b !== null)

  return (
    <div>
      <section className="bg-gradient-to-b from-amber-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            {t("hero")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">{t("subtitle")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/breeds/dog`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-amber-600 transition-colors"
            >
              {t("exploreDogs")}
            </Link>
            <Link
              href={`/${locale}/breeds/cat`}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-800 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-stone-700 transition-colors"
            >
              {t("exploreCats")}
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-sm text-stone-500">
            <span>{t("breedCount", { count: dogs.length })}</span>
            <span>{t("breedCount", { count: cats.length })}</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.key} className={`rounded-2xl border p-6 ${f.color}`}>
                <h3 className="text-lg font-semibold text-stone-900">
                  {t(`features.${f.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{t(`features.${f.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-2 text-center text-3xl font-bold text-stone-900">
            {t("featuredBreeds")}
          </h2>
          <p className="mb-8 text-center text-stone-500">{t("featuredBreedsDesc")}</p>
          <div className="mb-10">
            <h3 className="mb-4 text-xl font-semibold text-stone-800">
              {locale === "en" ? "Featured Dogs" : "精选犬种"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredDogs.map((breed) => (
                <Link
                  key={breed.id}
                  href={`/${locale}/breeds/dogs/${breed.id}`}
                  className="group rounded-xl border border-stone-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-md"
                >
                  <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-stone-100">
                    {breed.images?.[0] && (
                      <img src={breed.images[0]} alt={breed.name[locale as "en" | "zh"]} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-stone-800 group-hover:text-amber-700">
                    {breed.name[locale as "en" | "zh"]}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{breed.origin[locale as "en" | "zh"]}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold text-stone-800">
              {locale === "en" ? "Featured Cats" : "精选猫种"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCats.map((breed) => (
                <Link
                  key={breed.id}
                  href={`/${locale}/breeds/cats/${breed.id}`}
                  className="group rounded-xl border border-stone-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-md"
                >
                  <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-stone-100">
                    {breed.images?.[0] && (
                      <img src={breed.images[0]} alt={breed.name[locale as "en" | "zh"]} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-stone-800 group-hover:text-amber-700">
                    {breed.name[locale as "en" | "zh"]}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{breed.origin[locale as "en" | "zh"]}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold text-stone-900">
            {locale === "en" ? "Compare & Discover" : "对比与发现"}
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-stone-500">
            {locale === "en"
              ? "Compare breeds side-by-side or take our quiz to find your perfect match."
              : "并排对比品种特征，或通过问答测试找到适合你的宠物。"}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={`/${locale}/compare`}
              className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              {locale === "en" ? "Compare Breeds" : "对比品种"}
            </Link>
            <Link
              href={`/${locale}/quiz`}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {locale === "en" ? "Take the Quiz" : "开始测试"}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-stone-900 py-20 text-center text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold">{t("tryDiagnosis")}</h2>
          <p className="mt-4 text-stone-400">{t("diagnosisDesc")}</p>
          <Link
            href={`/${locale}/diagnose`}
            className="mt-8 inline-block rounded-xl bg-blue-500 px-8 py-4 font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            {t("tryDiagnosis")}
          </Link>
        </div>
      </section>
    </div>
  )
}