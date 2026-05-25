'use client'

import { useTranslations } from 'next-intl'

export default function AboutContent() {
  const t = useTranslations('about')

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-stone-900">{t('title')}</h1>
          <p className="mt-3 text-lg text-stone-600">{t('subtitle')}</p>
        </div>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-stone-800">{t('mission.title')}</h2>
          <p className="leading-relaxed text-stone-600">{t('mission.content')}</p>
        </section>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-stone-800">{t('operator.title')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {t('operator.name').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-stone-800">{t('operator.name')}</p>
              <p className="text-sm text-stone-500">{t('operator.role')}</p>
              <a
                href={`mailto:${t('operator.email')}`}
                className="mt-1 inline-block text-sm text-blue-600 hover:underline"
              >
                {t('operator.emailLabel')}: {t('operator.email')}
              </a>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-stone-800">{t('dataSources.title')}</h2>
          <p className="mb-6 text-stone-600">{t('dataSources.description')}</p>
          <div className="grid gap-6 md:grid-cols-2">
            <a
              href={t('dataSources.dogApi.url')}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-stone-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold text-stone-800">{t('dataSources.dogApi.name')}</h3>
              <p className="text-sm text-stone-600">{t('dataSources.dogApi.description')}</p>
            </a>
            <a
              href={t('dataSources.catApi.url')}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-stone-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold text-stone-800">{t('dataSources.catApi.name')}</h3>
              <p className="text-sm text-stone-600">{t('dataSources.catApi.description')}</p>
            </a>
          </div>
        </section>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-stone-800">{t('features.title')}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {(['encyclopedia', 'comparison', 'quiz', 'diagnosis'] as const).map((key) => (
              <div key={key} className="rounded-lg bg-stone-50 p-6">
                <h3 className="mb-2 font-semibold text-stone-800">{t(`features.${key}.title`)}</h3>
                <p className="text-sm text-stone-600">{t(`features.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-lg bg-yellow-50 p-6 text-center text-sm text-yellow-800">
          <p>{t('disclaimer')}</p>
          <p className="mt-2 text-stone-500">{t('lastUpdated')}</p>
        </div>
      </div>
    </div>
  )
}