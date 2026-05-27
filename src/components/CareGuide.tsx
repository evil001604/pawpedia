import { BreedCareGuide, Locale } from "@/types/breed"

const sections = [
  { key: "overview" as const, icon: "📋" },
  { key: "care" as const, icon: "🧴" },
  { key: "training" as const, icon: "🎓" },
  { key: "diet" as const, icon: "🍖" },
  { key: "livingTips" as const, icon: "🏠" },
]

const labels: Record<string, { en: string; zh: string }> = {
  overview: { en: "Breed Overview", zh: "品种概述" },
  care: { en: "Daily Care", zh: "日常养护" },
  training: { en: "Training Tips", zh: "训练建议" },
  diet: { en: "Diet & Nutrition", zh: "饮食指导" },
  livingTips: { en: "Living Environment", zh: "居住建议" },
}

export default function CareGuide({
  careGuide,
  locale,
  title,
}: {
  careGuide: BreedCareGuide
  locale: Locale
  title: string
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-xl font-bold text-stone-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {sections.map(({ key, icon }) => (
          <div key={key} className="rounded-xl border border-stone-200 bg-white p-5">
            <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-stone-800">
              <span>{icon}</span>
              {labels[key][locale]}
            </h3>
            <p className="text-sm leading-relaxed text-stone-600">
              {careGuide[key][locale]}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}