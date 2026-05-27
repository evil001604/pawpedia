import { loadBreeds } from "@/lib/breeds"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = locale as "en" | "zh"
  const title = l === "en" ? "Pet Health Guide — Care Tips & Breed-Specific Advice | PetPedia" : "宠物健康指南 — 护理技巧与品种专属建议 | PetPedia"
  const description = l === "en"
    ? "Comprehensive pet health guide covering nutrition, exercise, grooming, dental care, and breed-specific health advice for dogs and cats."
    : "全面的宠物健康指南，涵盖营养、运动、美容、口腔护理及犬猫品种专属健康建议。"
  return { title, description, openGraph: { title, description } }
}

const generalTips = {
  en: [
    { title: "Regular Checkups", desc: "Schedule annual veterinary visits for vaccinations and health screening." },
    { title: "Balanced Diet", desc: "Provide age-appropriate, high-quality pet food. Avoid toxic human foods." },
    { title: "Exercise", desc: "Ensure daily physical activity appropriate for your pet's breed and age." },
    { title: "Dental Care", desc: "Brush teeth regularly and provide dental treats to prevent oral disease." },
    { title: "Grooming", desc: "Regular brushing, nail trimming, and bathing based on coat type." },
    { title: "Hydration", desc: "Always provide fresh, clean water. Monitor intake for changes." },
  ],
  zh: [
    { title: "定期检查", desc: "每年安排兽医检查，确保疫苗接种和健康筛查。" },
    { title: "均衡饮食", desc: "提供适合年龄的优质宠物食品，避免有害的人类食物。" },
    { title: "适当运动", desc: "根据宠物品种和年龄，确保每天有足够的运动量。" },
    { title: "口腔护理", desc: "定期刷牙并提供洁齿零食，预防口腔疾病。" },
    { title: "梳理美容", desc: "根据毛发类型定期梳理、修剪指甲和洗澡。" },
    { title: "充足饮水", desc: "随时提供新鲜干净的水，注意饮水量的变化。" },
  ],
}

export default async function HealthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("health")
  const dogs = loadBreeds("dog")
  const cats = loadBreeds("cat")
  const tips = generalTips[locale as "en" | "zh"]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-2 text-stone-500">{t("subtitle")}</p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">{t("generalTips")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, i) => (
            <div key={i} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-800">{tip.title}</h3>
              <p className="mt-1 text-sm text-emerald-700">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-stone-900">{t("byBreed")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link href={`/${locale}/breeds/dog`} className="rounded-xl border border-stone-200 bg-white p-6 hover:shadow-md transition-shadow">
            <p className="text-4xl">Paw</p>
            <h3 className="mt-3 text-lg font-semibold">{t("dogBreeds", { count: dogs.length })}</h3>
            <p className="mt-1 text-sm text-stone-500">{t("viewDogs")}</p>
          </Link>
          <Link href={`/${locale}/breeds/cat`} className="rounded-xl border border-stone-200 bg-white p-6 hover:shadow-md transition-shadow">
            <p className="text-4xl">Paw</p>
            <h3 className="mt-3 text-lg font-semibold">{t("catBreeds", { count: cats.length })}</h3>
            <p className="mt-1 text-sm text-stone-500">{t("viewCats")}</p>
          </Link>
        </div>
      </section>
    </div>
  )
}