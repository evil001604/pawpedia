"use client"

import { useState, useCallback } from "react"
import { getDiagnosisResult, getSymptomCategories } from "@/lib/diagnosis"

export default function DiagnosePageClient({
  locale,
  stepType,
  stepSymptoms,
  stepResult,
  dog,
  cat,
  selectSymptomsHint,
  startDiagnosis,
  restart,
  diagnosisSuggestions,
  resultsBasedOn,
  probability,
  recommendedActions,
  noResults,
}: {
  locale: string
  stepType: string
  stepSymptoms: string
  stepResult: string
  dog: string
  cat: string
  selectSymptomsHint: string
  startDiagnosis: string
  restart: string
  diagnosisSuggestions: string
  resultsBasedOn: string
  probability: string
  recommendedActions: string
  noResults: string
}) {
  const [step, setStep] = useState<"type" | "symptoms" | "result">("type")
  const [petType, setPetType] = useState<"dog" | "cat" | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const isZh = locale === "zh"

  const categories = getSymptomCategories()
  const results = step === "result" ? getDiagnosisResult(selected) : []

  const toggleSymptom = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }, [])

  const handleDiagnose = () => {
    if (selected.length === 0) return
    setStep("result")
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "diagnose", petType, symptomCount: selected.length }),
    }).catch(() => {})
  }

  const stepLabels = [stepType, stepSymptoms, stepResult]
  const stepOrder = ["type", "symptoms", "result"] as const

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex justify-center gap-2">
        {stepOrder.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              step === s ? "bg-amber-500 text-white" : i < stepOrder.indexOf(step) ? "bg-emerald-500 text-white" : "bg-stone-200 text-stone-500"
            }`}>
              {i + 1}
            </span>
            <span className="text-sm font-medium text-stone-600 hidden sm:inline">
              {stepLabels[i]}
            </span>
          </div>
        ))}
      </div>

      {step === "type" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {(["dog", "cat"] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setPetType(type); setStep("symptoms") }}
              className="rounded-2xl border-2 border-stone-200 bg-white p-8 text-center hover:border-amber-400 hover:shadow-md transition-all"
            >
              <span className="text-5xl">Paw</span>
              <p className="mt-3 text-xl font-bold text-stone-800">{type === "dog" ? dog : cat}</p>
            </button>
          ))}
        </div>
      )}

      {step === "symptoms" && (
        <div>
          <p className="mb-4 text-sm text-stone-500">{selectSymptomsHint}</p>
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.en}>
                <h3 className="mb-2 text-sm font-semibold text-stone-700">{isZh ? cat.zh : cat.en}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.symptoms.map((s) => (
                    <button
                      key={s.en}
                      onClick={() => toggleSymptom(s.en)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selected.includes(s.en)
                          ? "bg-amber-500 text-white"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {isZh ? s.zh : s.en}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep("type")} className="rounded-xl px-6 py-2 text-sm text-stone-500 hover:bg-stone-100">
              &larr; {restart}
            </button>
            <button
              onClick={handleDiagnose}
              disabled={selected.length === 0}
              className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {startDiagnosis}
            </button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div>
          <h2 className="text-2xl font-bold text-stone-900">{diagnosisSuggestions}</h2>
          <p className="mt-2 text-stone-500">{resultsBasedOn}</p>

          {results.length > 0 ? (
            <div className="mt-6 space-y-4">
              {results.map((r, i) => (
                <div key={i} className="rounded-xl border border-stone-200 bg-white p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-stone-800">{isZh ? r.name.zh : r.name.en}</h3>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{probability}: {isZh ? r.probability.zh : r.probability.en}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{isZh ? r.description.zh : r.description.en}</p>
                  <p className="mt-3 text-sm font-medium text-amber-700">{recommendedActions}: {(isZh ? r.actions.zh : r.actions.en).join(", ")}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 py-8 text-center text-stone-500">{noResults}</p>
          )}

          <button
            onClick={() => { setStep("type"); setSelected([]); setPetType(null) }}
            className="mt-8 w-full rounded-xl border border-stone-300 px-6 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            {restart}
          </button>
        </div>
      )}
    </div>
  )
}