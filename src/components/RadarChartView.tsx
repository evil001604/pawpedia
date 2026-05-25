"use client"

import { BreedTraits, Locale } from "@/types/breed"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"

const traitLabels: Record<keyof BreedTraits, Record<Locale, string>> = {
  personality: { en: "Personality", zh: "性格" },
  temperament: { en: "Temperament", zh: "脾气" },
  loyalty: { en: "Loyalty", zh: "忠诚度" },
  intelligence: { en: "Intelligence", zh: "智商" },
  friendliness: { en: "Friendliness", zh: "亲人性" },
  energy: { en: "Energy", zh: "活跃度" },
}

export default function RadarChartView({ traits, locale }: { traits: BreedTraits; locale: Locale }) {
  const data = Object.entries(traits).map(([key, value]) => ({
    trait: traitLabels[key as keyof BreedTraits]?.[locale] || key,
    value,
  }))

  return (
    <div className="flex justify-center">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="trait" tick={{ fontSize: 12, fill: "#57534e" }} />
          <Radar name="Traits" dataKey="value" stroke="#d97706" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}