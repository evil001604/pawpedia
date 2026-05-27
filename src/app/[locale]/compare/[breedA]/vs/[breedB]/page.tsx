import { loadBreed, loadBreeds } from "@/lib/breeds"
import { compareBreeds } from "@/lib/comparison"
import { getSimilarBreeds } from "@/lib/similarity"
import { PetType } from "@/types/breed"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import RadarChartView from "@/components/RadarChartView"
import SimilarBreeds from "@/components/SimilarBreeds"

const POPULAR_PAIRS = [
  { type: "dog", a: "border-collie", b: "beagle" },
  { type: "dog", a: "bulldog", b: "alaskan-husky" },
  { type: "dog", a: "border-collie", b: "alaskan-husky" },
  { type: "dog", a: "chihuahua", b: "boston-terrier" },
  { type: "dog", a: "akita", b: "alaskan-malamute" },
  { type: "dog", a: "boxer", b: "bulldog" },
  { type: "dog", a: "dachshund", b: "basset-hound" },
  { type: "dog", a: "doberman-pinscher", b: "cane-corso" },
  { type: "dog", a: "dalmatian", b: "cocker-spaniel" },
  { type: "dog", a: "bull-terrier", b: "american-pit-bull-terrier" },
  { type: "dog", a: "border-collie", b: "australian-shepherd" },
  { type: "dog", a: "bloodhound", b: "basset-hound" },
  { type: "cat", a: "persian", b: "siamese" },
  { type: "cat", a: "maine-coon", b: "ragdoll" },
  { type: "cat", a: "bengal", b: "sphynx" },
  { type: "cat", a: "siamese", b: "burmese" },
  { type: "cat", a: "abyssinian", b: "somali" },
  { type: "cat", a: "british-shorthair", b: "scottish-fold" },
  { type: "cat", a: "bengal", b: "savannah" },
  { type: "cat", a: "devon-rex", b: "cornish-rex" },
  { type: "cat", a: "sphynx", b: "donskoy" },
]

export function generateStaticParams() {
  return POPULAR_PAIRS.map(({ type, a, b }) => ({
    breedA: a,
    breedB: b,
    locale: "en",
  })).concat(POPULAR_PAIRS.map(({ type, a, b }) => ({
    breedA: a,
    breedB: b,
    locale: "zh",
  })))
}

function findType(id: string): PetType | null {
  for (const type of ["dog", "cat"] as PetType[]) {
    const b = loadBreed(type, id)
    if (b) return type
  }
  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; breedA: string; breedB: string }>
}): Promise<Metadata> {
  const { locale, breedA: idA, breedB: idB } = await params
  const l = locale as "en" | "zh"

  const typeA = findType(idA)
  const typeB = findType(idB)
  if (!typeA || !typeB || typeA !== typeB) return {}

  const a = loadBreed(typeA, idA)
  const b = loadBreed(typeB, idB)
  if (!a || !b) return {}

  const title = l === "en"
    ? `${a.name.en} vs ${b.name.en} — Breed Comparison | PetPedia`
    : `${a.name.zh} vs ${b.name.zh} — 品种对比 | PetPedia`
  const description = l === "en"
    ? `Compare ${a.name.en} and ${b.name.en} across 10 dimensions: energy, intelligence, grooming, health, and more. Find the best breed for your lifestyle.`
    : `对比${a.name.zh}和${b.name.zh}的10个维度：精力、智商、美容、健康等。找到适合你的品种。`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: a.images?.[0] ? [{ url: a.images[0], width: 600, height: 400 }] : [],
    },
  }
}

const dimLabels: Record<string, { en: string; zh: string }> = {
  energy: { en: "Energy", zh: "精力" },
  intelligence: { en: "Intelligence", zh: "智商" },
  trainability: { en: "Trainability", zh: "可训性" },
  grooming: { en: "Grooming", zh: "美容需求" },
  shedding: { en: "Shedding", zh: "掉毛" },
  friendliness: { en: "Friendliness", zh: "友善度" },
  goodWithKids: { en: "Good with Kids", zh: "适合儿童" },
  adaptability: { en: "Adaptability", zh: "适应性" },
  health: { en: "Health", zh: "健康" },
  size: { en: "Size", zh: "体型" },
}

export default async function CompareArticlePage({
  params,
}: {
  params: Promise<{ locale: string; breedA: string; breedB: string }>
}) {
  const { locale, breedA: idA, breedB: idB } = await params
  const l = locale as "en" | "zh"

  const typeA = findType(idA)
  const typeB = findType(idB)
  if (!typeA || !typeB || typeA !== typeB) notFound()

  const a = loadBreed(typeA, idA)
  const b = loadBreed(typeB, idB)
  if (!a || !b) notFound()

  const comparison = compareBreeds(a, b)
  const allBreeds = loadBreeds(typeA)
  const similarBreeds = getSimilarBreeds(a, allBreeds, 4)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pawpedia.xyz"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": l === "en"
      ? `${a.name.en} vs ${b.name.en} — Breed Comparison`
      : `${a.name.zh} vs ${b.name.zh} — 品种对比`,
    "description": l === "en"
      ? `Comprehensive comparison of ${a.name.en} and ${b.name.en} breed traits.`
      : `${a.name.zh}和${b.name.zh}品种特征全面对比。`,
    "url": `${baseUrl}/${locale}/compare/${idA}/vs/${idB}`,
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-4 text-sm text-stone-500">
        <Link href={`/${locale}`} className="hover:text-amber-600">Home</Link>
        {" / "}
        <Link href={`/${locale}/breeds`} className="hover:text-amber-600">
          {l === "en" ? "Breeds" : "品种"}
        </Link>
        {" / "}
        <Link href={`/${locale}/compare`} className="hover:text-amber-600">
          {l === "en" ? "Compare" : "对比"}
        </Link>
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-stone-900">
        {l === "en"
          ? `${a.name.en} vs ${b.name.en}`
          : `${a.name.zh} vs ${b.name.zh}`}
      </h1>
      <p className="mb-8 text-stone-500">
        {l === "en"
          ? `Detailed comparison of these two ${typeA} breeds across 10 key dimensions.`
          : `这两个${typeA === "dog" ? "犬" : "猫"}种的10个关键维度详细对比。`}
      </p>

      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
            {a.images?.[0] ? (
              <Image src={a.images[0]} alt={a.name[l]} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-stone-100 text-4xl text-stone-300">Paw</div>
            )}
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            <Link href={`/${locale}/breeds/${typeA}s/${a.id}`} className="hover:text-amber-600">
              {a.name[l]}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-stone-500">{a.origin[l]}</p>
          <p className="mt-2 text-sm text-stone-600">{a.history[l]?.slice(0, 200)}...</p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
            {b.images?.[0] ? (
              <Image src={b.images[0]} alt={b.name[l]} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-stone-100 text-4xl text-stone-300">Paw</div>
            )}
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            <Link href={`/${locale}/breeds/${typeA}s/${b.id}`} className="hover:text-amber-600">
              {b.name[l]}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-stone-500">{b.origin[l]}</p>
          <p className="mt-2 text-sm text-stone-600">{b.history[l]?.slice(0, 200)}...</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-stone-900">
          {l === "en" ? "Comparison Results" : "对比结果"}
        </h2>
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="p-3 text-left font-medium text-stone-700">
                  {l === "en" ? "Dimension" : "维度"}
                </th>
                <th className="p-3 text-center font-medium text-stone-700">
                  <Link href={`/${locale}/breeds/${typeA}s/${a.id}`} className="text-amber-600 hover:underline">
                    {a.name[l]}
                  </Link>
                </th>
                <th className="p-3 text-center font-medium text-stone-700">
                  <Link href={`/${locale}/breeds/${typeA}s/${b.id}`} className="text-amber-600 hover:underline">
                    {b.name[l]}
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.dimensions.map((dim) => (
                <tr key={dim.dimension} className="border-t border-stone-100">
                  <td className="p-3 font-medium text-stone-700">
                    {dimLabels[dim.dimension]?.[l] || dim.dimension}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-2">
                      <span className={`text-sm font-semibold ${dim.scoreA > dim.scoreB ? "text-green-600" : "text-stone-600"}`}>
                        {dim.scoreA}
                      </span>
                      <span className="h-1.5 w-16 rounded-full bg-stone-100">
                        <span
                          className="block h-full rounded-full bg-amber-500"
                          style={{ width: `${dim.scoreA * 10}%` }}
                        />
                      </span>
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-2">
                      <span className={`text-sm font-semibold ${dim.scoreB > dim.scoreA ? "text-green-600" : "text-stone-600"}`}>
                        {dim.scoreB}
                      </span>
                      <span className="h-1.5 w-16 rounded-full bg-stone-100">
                        <span
                          className="block h-full rounded-full bg-blue-500"
                          style={{ width: `${dim.scoreB * 10}%` }}
                        />
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {comparison.summary.winner !== "tie" && (
          <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            {l === "en" ? (
              <><strong>{comparison.summary.winner === "A" ? a.name.en : b.name.en}</strong> scores higher overall with {comparison.summary.winner === "A" ? comparison.summary.strengthsA.length : comparison.summary.strengthsB.length} winning dimensions out of 10.</>
            ) : (
              <><strong>{comparison.summary.winner === "A" ? a.name.zh : b.name.zh}</strong> 在10个维度中胜出{comparison.summary.winner === "A" ? comparison.summary.strengthsA.length : comparison.summary.strengthsB.length}个，综合表现更优。</>
            )}
          </div>
        )}
      </section>

      <section className="mb-10">
        <RadarChartView traits={a.traits} locale={l} />
      </section>

      <section className="mb-10">
        <RadarChartView traits={b.traits} locale={l} />
      </section>

      <SimilarBreeds breeds={similarBreeds} locale={l} title={l === "en" ? "Similar Breeds" : "相似品种"} />

      <div className="mt-8 rounded-xl border-2 border-amber-100 bg-amber-50 p-6 text-center">
        <p className="mb-3 text-lg font-semibold text-amber-900">
          {l === "en" ? "Compare other breeds" : "对比其他品种"}
        </p>
        <Link
          href={`/${locale}/compare`}
          className="inline-block rounded-lg bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 transition-colors"
        >
          {l === "en" ? "Go to Comparison Tool →" : "前往对比工具 →"}
        </Link>
      </div>
    </div>
  )
}