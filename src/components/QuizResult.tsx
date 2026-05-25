'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { QuizResult } from '@/lib/quiz-matching'

interface QuizResultViewProps {
  results: QuizResult[]
  onRestart: () => void
}

export default function QuizResultView({ results, onRestart }: QuizResultViewProps) {
  const t = useTranslations('quiz')
  const locale = useLocale() as 'en' | 'zh'

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-stone-900">{t('noResults')}</h1>
          <button
            onClick={onRestart}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {t('restart')}
          </button>
        </div>
      </div>
    )
  }

  const compareIds = results.map(r => r.breed.id).join(',')

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-stone-900">{t('resultTitle')}</h1>
          <p className="text-lg text-stone-600">{t('resultSubtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {results.map((result, index) => (
            <div
              key={result.breed.id}
              className="rounded-xl border-2 border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative mb-4">
                <img
                  src={result.breed.images?.[0]}
                  alt={result.breed.name[locale]}
                  className="h-48 w-full rounded-lg object-cover"
                />
                <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-md">
                  {index + 1}
                </div>
              </div>

              <h3 className="mb-1 text-xl font-bold text-stone-900">
                {result.breed.name[locale]}
              </h3>
              <p className="mb-4 text-sm text-stone-500">{result.breed.origin[locale]}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700">{t('matchScore')}</span>
                  <span className="text-2xl font-bold text-blue-600">{result.matchScore}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${result.matchScore}%` }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {t('reasons')}
                </p>
                <ul className="space-y-1.5">
                  {result.matchReasons.map((reason) => (
                    <li key={reason} className="flex items-start gap-2 text-xs text-stone-600">
                      <span className="mt-0.5 text-green-500">•</span>
                      <span>{t(`reasonsLabel.${reason}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/${locale}/breeds/${result.breed.type}s/${result.breed.id}`}
                className="block rounded-lg bg-stone-100 py-2 text-center text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
              >
                {t('viewDetails')}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href={`/${locale}/compare`}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {t('compareSelected')}
          </Link>
          <button
            onClick={onRestart}
            className="rounded-lg bg-stone-100 px-8 py-3 font-medium text-stone-700 transition-colors hover:bg-stone-200"
          >
            {t('restart')}
          </button>
        </div>
      </div>
    </div>
  )
}