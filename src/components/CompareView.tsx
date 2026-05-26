'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { compareBreeds, ComparisonResult } from '@/lib/comparison'
import { getSimilarBreeds } from '@/lib/similarity'
import { Breed } from '@/types/breed'
import SimilarBreeds from './SimilarBreeds'

type ViewMode = 'selection' | 'result'

interface CompareViewProps {
  dogBreeds: Breed[]
  catBreeds: Breed[]
}

export default function CompareView({ dogBreeds, catBreeds }: CompareViewProps) {
  const t = useTranslations('compare')
  const locale = useLocale() as 'en' | 'zh'
  const [viewMode, setViewMode] = useState<ViewMode>('selection')
  const [breedAId, setBreedAId] = useState<string>('')
  const [breedBId, setBreedBId] = useState<string>('')
  const [selectedType, setSelectedType] = useState<'dog' | 'cat'>('dog')
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [error, setError] = useState<string>('')

  const currentBreeds = selectedType === 'dog' ? dogBreeds : catBreeds

  const handleStartComparison = () => {
    setError('')

    if (!breedAId || !breedBId) {
      setError(t('noBreedSelected'))
      return
    }

    if (breedAId === breedBId) {
      setError(t('error.sameSpecies'))
      return
    }

    const breedA = currentBreeds.find(b => b.id === breedAId)
    const breedB = currentBreeds.find(b => b.id === breedBId)

    if (!breedA || !breedB) return

    const result = compareBreeds(breedA, breedB)
    setComparisonResult(result)
    setViewMode('result')
  }

  const handleTypeChange = (type: 'dog' | 'cat') => {
    setSelectedType(type)
    setBreedAId('')
    setBreedBId('')
    setError('')
  }

  const selectedBreedA = currentBreeds.find(b => b.id === breedAId)
  const selectedBreedB = currentBreeds.find(b => b.id === breedBId)

  if (viewMode === 'result' && comparisonResult) {
    return (
      <ComparisonResultView
        result={comparisonResult}
        locale={locale}
        onBack={() => setViewMode('selection')}
        allBreeds={currentBreeds}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-stone-900">{t('title')}</h1>
          <p className="mt-3 text-lg text-stone-600">{t('subtitle')}</p>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => handleTypeChange('dog')}
            className={`rounded-lg px-6 py-3 font-medium transition-colors ${
              selectedType === 'dog'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🐕 Dogs
          </button>
          <button
            onClick={() => handleTypeChange('cat')}
            className={`rounded-lg px-6 py-3 font-medium transition-colors ${
              selectedType === 'cat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🐈 Cats
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border-2 border-stone-200 bg-white p-6 shadow-sm">
            <label className="mb-3 block text-lg font-semibold text-stone-800">
              {t('selectBreedA')}
            </label>
            <select
              value={breedAId}
              onChange={(e) => setBreedAId(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('noBreedSelected')}</option>
              {currentBreeds.map((breed) => (
                <option key={breed.id} value={breed.id} disabled={breed.id === breedBId}>
                  {breed.name[locale]}
                </option>
              ))}
            </select>
            {selectedBreedA && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-stone-50 p-4">
                <img
                  src={selectedBreedA.images?.[0]}
                  alt={selectedBreedA.name[locale]}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-stone-800">{selectedBreedA.name[locale]}</p>
                  <p className="text-sm text-stone-500">{selectedBreedA.origin[locale]}</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border-2 border-stone-200 bg-white p-6 shadow-sm">
            <label className="mb-3 block text-lg font-semibold text-stone-800">
              {t('selectBreedB')}
            </label>
            <select
              value={breedBId}
              onChange={(e) => setBreedBId(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('noBreedSelected')}</option>
              {currentBreeds.map((breed) => (
                <option key={breed.id} value={breed.id} disabled={breed.id === breedAId}>
                  {breed.name[locale]}
                </option>
              ))}
            </select>
            {selectedBreedB && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-stone-50 p-4">
                <img
                  src={selectedBreedB.images?.[0]}
                  alt={selectedBreedB.name[locale]}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-stone-800">{selectedBreedB.name[locale]}</p>
                  <p className="text-sm text-stone-500">{selectedBreedB.origin[locale]}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleStartComparison}
            disabled={!breedAId || !breedBId}
            className="rounded-lg bg-blue-600 px-12 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
          >
            {t('startComparison')}
          </button>
        </div>
      </div>
    </div>
  )
}

function ComparisonResultView({
  result,
  locale,
  onBack,
  allBreeds
}: {
  result: ComparisonResult
  locale: 'en' | 'zh'
  onBack: () => void
  allBreeds: Breed[]
}) {
  const t = useTranslations('compare')

  const similarBreeds = getSimilarBreeds(result.breedA, allBreeds, 4)

  const getScoreLabel = (score: number): string => {
    if (score <= 2) return t('scoreLabels.1')
    if (score <= 4) return t('scoreLabels.3')
    if (score <= 6) return t('scoreLabels.5')
    if (score <= 8) return t('scoreLabels.7')
    return t('scoreLabels.9')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <button
          onClick={onBack}
          className="mb-6 rounded-lg bg-stone-100 px-6 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
        >
          ← {t('backToSelection')}
        </button>

        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            <div className="text-center">
              <img
                src={result.breedA.images[0]}
                alt={result.breedA.name[locale]}
                className="mx-auto mb-3 h-32 w-32 rounded-xl object-cover shadow-md"
              />
              <h2 className="text-xl font-bold text-stone-900">{result.breedA.name[locale]}</h2>
              <p className="mt-2 text-4xl font-bold text-blue-600">{result.summary.totalA}<span className="text-lg text-stone-400">/100</span></p>
            </div>

            <div className="text-3xl font-bold text-stone-300">{t('vs')}</div>

            <div className="text-center">
              <img
                src={result.breedB.images[0]}
                alt={result.breedB.name[locale]}
                className="mx-auto mb-3 h-32 w-32 rounded-xl object-cover shadow-md"
              />
              <h2 className="text-xl font-bold text-stone-900">{result.breedB.name[locale]}</h2>
              <p className="mt-2 text-4xl font-bold text-blue-600">{result.summary.totalB}<span className="text-lg text-stone-400">/100</span></p>
            </div>
          </div>

          <div className="mt-8 inline-block rounded-full px-8 py-3 bg-green-50 border border-green-200">
            <span className="text-lg font-semibold text-green-800">
              {result.summary.winner === 'tie'
                ? t('tie')
                : `${t('winner')}: ${result.summary.winner === 'A' ? result.breedA.name[locale] : result.breedB.name[locale]}`}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {result.dimensions.map((dim) => (
            <div key={dim.dimension} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-stone-800">{t(`dimensions.${dim.dimension}`)}</h3>
                <p className="text-xs text-stone-400">{t(`dimensions.${dim.dimension}Desc`)}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-stone-600">{result.breedA.name[locale]}</span>
                    <span className="font-bold text-blue-600">{dim.scoreA}/10</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dim.scoreA > dim.scoreB ? 'bg-blue-600' : 'bg-blue-300'
                      }`}
                      style={{ width: `${dim.scoreA * 10}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-stone-400">{getScoreLabel(dim.scoreA)}</p>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-stone-600">{result.breedB.name[locale]}</span>
                    <span className="font-bold text-blue-600">{dim.scoreB}/10</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dim.scoreB > dim.scoreA ? 'bg-blue-600' : 'bg-blue-300'
                      }`}
                      style={{ width: `${dim.scoreB * 10}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-stone-400">{getScoreLabel(dim.scoreB)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              {result.breedA.name[locale]} — {t('strengths')}
            </h3>
            {result.summary.strengthsA.length > 0 ? (
              <ul className="space-y-1.5">
                {result.summary.strengthsA.map((strength) => (
                  <li key={strength} className="flex items-center gap-2 text-sm text-blue-800">
                    <span className="text-green-500">✓</span>
                    {t(`dimensions.${strength}`)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-blue-700">No unique strengths</p>
            )}
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              {result.breedB.name[locale]} — {t('strengths')}
            </h3>
            {result.summary.strengthsB.length > 0 ? (
              <ul className="space-y-1.5">
                {result.summary.strengthsB.map((strength) => (
                  <li key={strength} className="flex items-center gap-2 text-sm text-green-800">
                    <span className="text-green-500">✓</span>
                    {t(`dimensions.${strength}`)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-700">No unique strengths</p>
            )}
          </div>
        </div>

        <SimilarBreeds breeds={similarBreeds} locale={locale} title={t('similarBreeds')} />

        <div className="mt-8 rounded-xl border-2 border-blue-100 bg-blue-50 p-6 text-center">
          <p className="mb-3 text-lg font-semibold text-blue-900">{t('findMatch')}</p>
          <Link
            href={`/${locale}/quiz`}
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {t('takeQuiz')} →
          </Link>
        </div>
      </div>
    </div>
  )
}