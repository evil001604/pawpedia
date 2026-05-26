import { loadBreed, loadBreeds } from "@/lib/breeds"
import { getSimilarBreeds } from "@/lib/similarity"
import { PetType } from "@/types/breed"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import RadarChartView from "@/components/RadarChartView"
import HealthPanel from "@/components/HealthPanel"
import ProductRecommend from "@/components/ProductRecommend"
import ChatPanel from "@/components/ChatPanel"
import SimilarBreeds from "@/components/SimilarBreeds"

export async function generateStaticParams() {
  const locales = ["en", "zh"]
  const types = ["dog", "cat"] as const
  const paths: { locale: string; type: string; id: string }[] = []

  for (const locale of locales) {
    for (const type of types) {
      const breeds = loadBreeds(type)
      for (const breed of breeds) {
        paths.push({ locale, type, id: breed.id })
      }
    }
  }
  return paths
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string; id: string }>
}) {
  const { locale, type, id } = await params
  if (type !== "dog" && type !== "cat") return {}
  const breed = loadBreed(type as PetType, id)
  if (!breed) return {}
  const l = locale as "en" | "zh"
  return {
    title: `${breed.name[l]} - PetPedia`,
    description: `${breed.name[l]} - ${breed.type === "dog" ? "Dog" : "Cat"} breed information`,
    openGraph: { title: breed.name[l] },
  }
}

export default async function BreedDetailPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; id: string }>
}) {
  const { locale, type, id } = await params
  if (type !== "dog" && type !== "cat") notFound()

  const breed = loadBreed(type as PetType, id)
  if (!breed) notFound()

  const allBreeds = loadBreeds(type as PetType)
  const similarBreeds = getSimilarBreeds(breed, allBreeds, 4)

  const t = await getTranslations("detail")
  const bt = await getTranslations("breeds")
  const ct = await getTranslations("common")
  const pt = await getTranslations("products")
  const l = locale as "en" | "zh"

  const imageUrl = breed.images?.[0]
  const isExternal = imageUrl?.startsWith("http")
  const weightStr = breed.stats.weight.male === breed.stats.weight.female
    ? `${breed.stats.weight.male} kg`
    : `${ct("male")}: ${breed.stats.weight.male} kg | ${ct("female")}: ${breed.stats.weight.female} kg`

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href={`/${locale}/breeds/${type}`} className="text-sm text-amber-600 hover:underline">
        &larr; {type === "dog" ? t("allDogs") : t("allCats")}
      </Link>

      {imageUrl ? (
        <div className="mt-6">
          {isExternal ? (
            <Image src={imageUrl} alt={breed.name[l]} width={600} height={400} className="h-80 w-full rounded-2xl object-cover" unoptimized />
          ) : (
            <Image src={imageUrl} alt={breed.name[l]} width={600} height={400} className="h-80 w-full rounded-2xl object-cover" />
          )}
        </div>
      ) : (
        <div className="mt-6 flex h-80 w-full items-center justify-center rounded-2xl bg-stone-100 text-6xl text-stone-300">
          Paw
        </div>
      )}

      <h1 className="mt-6 text-3xl font-extrabold text-stone-900">{breed.name[l]}</h1>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
        <span>{breed.origin[l]}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-sm text-stone-600">
        <div><span className="font-medium text-stone-500">{bt("weight")}: </span>{weightStr}</div>
        <div><span className="font-medium text-stone-500">{bt("lifespan")}: </span>{breed.stats.lifespan[l]}</div>
      </div>

      {breed.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {breed.tags.map((tag) => (
            <span key={tag.en} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              {tag[l]}
            </span>
          ))}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">{t("history")}</h2>
        {breed.history?.[l] ? (
          <p className="mt-3 text-stone-600 leading-relaxed">{breed.history[l]}</p>
        ) : (
          <p className="mt-3 text-stone-400 italic">{t("noHistory")}</p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">{t("traits")}</h2>
        <RadarChartView traits={breed.traits} locale={l} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">{t("health")}</h2>
        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-6">
          <HealthPanel
            health={breed.health}
            locale={l}
            sheddingLabel={t("shedding")}
            diseasesLabel={t("diseases")}
            symptomsLabel={t("symptoms")}
            preventionLabel={t("prevention")}
            careTipsLabel={t("careTips")}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">{t("products")}</h2>
        <div className="mt-4">
          <ProductRecommend breed={breed} locale={l} forLabel={pt("for", { breed: breed.name[l] })} />
        </div>
      </section>

      <section className="mt-10 rounded-xl border-2 border-blue-100 bg-blue-50 p-6 text-center">
        <p className="text-lg font-semibold text-blue-900">{t("diagnoseCTA")}</p>
        <Link
          href={`/${locale}/diagnose`}
          className="mt-4 inline-block rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white hover:bg-blue-600 transition-colors"
        >
          {t("diagnoseButton")}
        </Link>
      </section>

      <section className="mt-10 rounded-xl border-2 border-amber-100 bg-amber-50 p-6 text-center">
        <p className="text-lg font-semibold text-amber-900">Want to see how {breed.name[l]} stacks up?</p>
        <Link
          href={`/${locale}/compare`}
          className="mt-4 inline-block rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 transition-colors"
        >
          {t("compareCTA")}
        </Link>
      </section>

      <SimilarBreeds breeds={similarBreeds} locale={l} title={t("similarBreeds")} />

      <ChatPanel
        breedId={id}
        label={t("chat")}
        placeholder={t("chatPlaceholder")}
        sendLabel={t("chatSend")}
        emptyLabel={t("chatEmpty")}
        namePlaceholder={t("chatNamePlaceholder")}
        anonymousLabel={t("chatAnonymous")}
      />
    </div>
  )
}