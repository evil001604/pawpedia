import { getTranslations } from "next-intl/server"
import { loadBreeds } from "@/lib/breeds"
import Link from "next/link"

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