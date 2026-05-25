import { BreedHealth, Locale } from "@/types/breed"

const sheddingBars: Record<number, string> = { 1: "w-1/5", 2: "w-2/5", 3: "w-3/5", 4: "w-4/5", 5: "w-full" }

export default function HealthPanel({
  health,
  locale,
  sheddingLabel,
  diseasesLabel,
  symptomsLabel,
  preventionLabel,
  careTipsLabel,
}: {
  health: BreedHealth
  locale: Locale
  sheddingLabel: string
  diseasesLabel: string
  symptomsLabel: string
  preventionLabel: string
  careTipsLabel: string
}) {
  const barWidth = sheddingBars[health.sheddingLevel] || "w-3/5"

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wide">{sheddingLabel}</h4>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-3 flex-1 rounded-full bg-stone-200">
            <div className={`h-full rounded-full bg-amber-400 ${barWidth}`} />
          </div>
          <span className="text-sm font-medium text-stone-700">{health.shedding[locale]}</span>
        </div>
      </div>

      {health.diseases.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wide">{diseasesLabel}</h4>
          <ul className="mt-2 space-y-3">
            {health.diseases.map((d, i) => (
              <li key={i} className="rounded-lg border border-stone-200 p-3">
                <p className="font-medium text-stone-800">{d.name[locale]}</p>
                {d.symptoms[locale].length > 0 && (
                  <p className="mt-1 text-xs text-stone-500">
                    {symptomsLabel}: {d.symptoms[locale].join(", ")}
                  </p>
                )}
                {d.prevention[locale].length > 0 && (
                  <p className="mt-1 text-xs text-stone-500">
                    {preventionLabel}: {d.prevention[locale].join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wide">{careTipsLabel}</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-stone-700 space-y-1">
          {health.careTips[locale].map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}